package com.omizoon.PaymentService.controller;


import com.omizoon.PaymentService.dto.PaymentRequest;
import com.omizoon.PaymentService.dto.PaymentVerifyRequest;
import com.omizoon.PaymentService.dto.RazorpayOrderResponse;
import com.omizoon.PaymentService.entity.Payment;
import com.omizoon.PaymentService.service.PaymentService;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;


    // =====================================================
    // CREATE PAYMENT
    // =====================================================

    @PostMapping("/create")
    public ResponseEntity<RazorpayOrderResponse>
    createPayment(@Valid @RequestBody PaymentRequest request) {

        return ResponseEntity.ok(
                paymentService.createPayment(request)
        );
    }


    // =====================================================
    // VERIFY PAYMENT
    // =====================================================

    @PostMapping("/verify")
    public ResponseEntity<Payment>
    verifyPayment(
            @Valid
            @RequestBody
            PaymentVerifyRequest request
    ) {

        return ResponseEntity.ok(
                paymentService.verifyPayment(request)
        );
    }


    // =====================================================
    // GET PAYMENT BY ID
    // =====================================================

    @GetMapping("/{id}")
    public ResponseEntity<Payment>
    getPaymentById(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                paymentService.getPaymentById(id)
        );
    }


    // =====================================================
    // GET PAYMENT BY ORDER ID
    // =====================================================

    @GetMapping("/order/{orderId}")
    public ResponseEntity<Payment>
    getPaymentByOrderId(
            @PathVariable Long orderId
    ) {

        return ResponseEntity.ok(
                paymentService.getPaymentByOrderId(
                        orderId
                )
        );
    }


    // =====================================================
    // GET ALL PAYMENTS
    // =====================================================

    @GetMapping
    public ResponseEntity<List<Payment>>
    getAllPayments() {

        return ResponseEntity.ok(
                paymentService.getAllPayments()
        );
    }
}