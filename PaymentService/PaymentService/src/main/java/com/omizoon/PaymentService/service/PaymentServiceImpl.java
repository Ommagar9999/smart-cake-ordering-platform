package com.omizoon.PaymentService.service;

import com.omizoon.PaymentService.Enum.PaymentStatus;
import com.omizoon.PaymentService.dto.PaymentEvent;
import com.omizoon.PaymentService.dto.PaymentRequest;
import com.omizoon.PaymentService.dto.PaymentVerifyRequest;
import com.omizoon.PaymentService.dto.RazorpayOrderResponse;
import com.omizoon.PaymentService.entity.Payment;
import com.omizoon.PaymentService.kafka.PaymentKafkaProducer;
import com.omizoon.PaymentService.reppository.PaymentRepository;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;

import lombok.RequiredArgsConstructor;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.Formatter;
import java.util.List;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl
        implements PaymentService {

    private final PaymentRepository paymentRepository;

    private final PaymentKafkaProducer paymentKafkaProducer;

    @Value("${razorpay.key.id}")
    private String razorpayKeyId;

    @Value("${razorpay.key.secret}")
    private String razorpayKeySecret;


    // =====================================================
    // CREATE PAYMENT
    // =====================================================

    @Override
    @Transactional
    public RazorpayOrderResponse createPayment(
            PaymentRequest request
    ) {

        try {

            Payment existingPayment =
                    paymentRepository
                            .findByOrderId(
                                    request.getOrderId()
                            )
                            .orElse(null);


            if (existingPayment != null
                    && existingPayment.getStatus()
                    == PaymentStatus.SUCCESS) {

                throw new RuntimeException(
                        "Payment already completed for order: "
                                + request.getOrderId()
                );
            }


            RazorpayClient razorpayClient =
                    new RazorpayClient(
                            razorpayKeyId,
                            razorpayKeySecret
                    );


            int amountInPaise =
                    (int) Math.round(
                            request.getAmount() * 100
                    );


            JSONObject orderRequest =
                    new JSONObject();

            orderRequest.put(
                    "amount",
                    amountInPaise
            );

            orderRequest.put(
                    "currency",
                    "INR"
            );

            orderRequest.put(
                    "receipt",
                    "cakeon_order_"
                            + request.getOrderId()
            );


            Order razorpayOrder =
                    razorpayClient.orders.create(
                            orderRequest
                    );


            Payment payment;


            // =================================================
            // EXISTING PAYMENT
            // =================================================

            if (existingPayment != null) {

                payment = existingPayment;

                payment.setRazorpayOrderId(
                        razorpayOrder.get("id")
                );

                payment.setAmount(
                        request.getAmount()
                );

                payment.setCurrency("INR");

                payment.setStatus(
                        PaymentStatus.CREATED
                );

                payment.setUpdatedAt(
                        LocalDateTime.now()
                );

            }


            // =================================================
            // NEW PAYMENT
            // =================================================

            else {

                payment =
                        Payment.builder()
                                .orderId(
                                        request.getOrderId()
                                )
                                .userId(
                                        request.getUserId()
                                )
                                .amount(
                                        request.getAmount()
                                )
                                .currency("INR")
                                .razorpayOrderId(
                                        razorpayOrder.get("id")
                                )
                                .status(
                                        PaymentStatus.CREATED
                                )
                                .build();
            }


            Payment savedPayment =
                    paymentRepository.save(payment);


            return RazorpayOrderResponse
                    .builder()
                    .paymentId(
                            savedPayment.getId()
                    )
                    .orderId(
                            savedPayment.getOrderId()
                    )
                    .razorpayOrderId(
                            savedPayment
                                    .getRazorpayOrderId()
                    )
                    .amount(
                            savedPayment.getAmount()
                    )
                    .currency(
                            savedPayment.getCurrency()
                    )
                    .status(
                            savedPayment
                                    .getStatus()
                                    .name()
                    )
                    .build();


        } catch (Exception e) {

            throw new RuntimeException(
                    "Unable to create Razorpay order: "
                            + e.getMessage(),
                    e
            );
        }
    }


    // =====================================================
    // VERIFY PAYMENT
    // =====================================================

    @Override
    @Transactional
    public Payment verifyPayment(
            PaymentVerifyRequest request
    ) {


        // =================================================
        // STEP 1: FIND PAYMENT
        // =================================================

        Payment payment =
                paymentRepository
                        .findByRazorpayOrderId(
                                request.getRazorpayOrderId()
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Payment record not found"
                                )
                        );


        // =================================================
        // STEP 2: GENERATE SIGNATURE
        // =================================================

        String generatedSignature =
                generateSignature(
                        request.getRazorpayOrderId(),
                        request.getRazorpayPaymentId(),
                        razorpayKeySecret
                );


        // =================================================
        // STEP 3: VERIFY SIGNATURE
        // =================================================

        if (!generatedSignature.equals(
                request.getRazorpaySignature()
        )) {

            payment.setStatus(
                    PaymentStatus.FAILED
            );

            payment.setUpdatedAt(
                    LocalDateTime.now()
            );

            paymentRepository.save(payment);


            throw new RuntimeException(
                    "Payment signature verification failed"
            );
        }


        // =================================================
        // STEP 4: PAYMENT SUCCESS
        // =================================================

        payment.setRazorpayPaymentId(
                request.getRazorpayPaymentId()
        );

        payment.setRazorpaySignature(
                request.getRazorpaySignature()
        );

        payment.setStatus(
                PaymentStatus.SUCCESS
        );

        payment.setUpdatedAt(
                LocalDateTime.now()
        );


        Payment savedPayment =
                paymentRepository.save(payment);


        // =================================================
        // STEP 5: CREATE KAFKA EVENT
        // =================================================

        PaymentEvent paymentEvent =
                PaymentEvent.builder()
                        .paymentId(
                                savedPayment.getId()
                        )
                        .orderId(
                                savedPayment.getOrderId()
                        )
                        .userId(
                                savedPayment.getUserId()
                        )
                        .amount(
                                savedPayment.getAmount()
                        )
                        .currency(
                                savedPayment.getCurrency()
                        )
                        .status(
                                savedPayment
                                        .getStatus()
                                        .name()
                        )
                        .paymentTime(
                                LocalDateTime.now()
                        )
                        .build();


        // =================================================
        // STEP 6: SEND EVENT TO KAFKA
        // =================================================

        paymentKafkaProducer.sendPaymentSuccess(
                paymentEvent
        );


        // =================================================
        // STEP 7: RETURN PAYMENT
        // =================================================

        return savedPayment;
    }


    // =====================================================
    // GET PAYMENT BY ID
    // =====================================================

    @Override
    public Payment getPaymentById(Long id) {

        return paymentRepository
                .findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Payment not found with id: "
                                        + id
                        )
                );
    }


    // =====================================================
    // GET PAYMENT BY ORDER ID
    // =====================================================

    @Override
    public Payment getPaymentByOrderId(
            Long orderId
    ) {

        return paymentRepository
                .findByOrderId(orderId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Payment not found for order: "
                                        + orderId
                        )
                );
    }


    // =====================================================
    // GET ALL PAYMENTS
    // =====================================================

    @Override
    public List<Payment> getAllPayments() {

        return paymentRepository.findAll();
    }


    // =====================================================
    // GENERATE RAZORPAY SIGNATURE
    // =====================================================

    private String generateSignature(
            String razorpayOrderId,
            String razorpayPaymentId,
            String secret
    ) {

        try {

            String data =
                    razorpayOrderId
                            + "|"
                            + razorpayPaymentId;


            Mac sha256Hmac =
                    Mac.getInstance(
                            "HmacSHA256"
                    );


            SecretKeySpec secretKey =
                    new SecretKeySpec(
                            secret.getBytes(
                                    StandardCharsets.UTF_8
                            ),
                            "HmacSHA256"
                    );


            sha256Hmac.init(secretKey);


            byte[] hash =
                    sha256Hmac.doFinal(
                            data.getBytes(
                                    StandardCharsets.UTF_8
                            )
                    );


            Formatter formatter =
                    new Formatter();


            for (byte b : hash) {

                formatter.format(
                        "%02x",
                        b
                );
            }


            String result =
                    formatter.toString();


            formatter.close();


            return result;


        } catch (Exception e) {

            throw new RuntimeException(
                    "Unable to generate payment signature",
                    e
            );
        }
    }
}