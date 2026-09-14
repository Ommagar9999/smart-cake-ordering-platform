package com.omizoon.PaymentService.service;


import com.omizoon.PaymentService.dto.PaymentRequest;
import com.omizoon.PaymentService.dto.PaymentVerifyRequest;
import com.omizoon.PaymentService.dto.RazorpayOrderResponse;
import com.omizoon.PaymentService.entity.Payment;

import java.util.List;

public interface PaymentService {

    RazorpayOrderResponse createPayment(PaymentRequest request);


    Payment verifyPayment(PaymentVerifyRequest request);


    Payment getPaymentById(Long id);

    Payment getPaymentByOrderId(Long orderId);

    List<Payment> getAllPayments();
}
