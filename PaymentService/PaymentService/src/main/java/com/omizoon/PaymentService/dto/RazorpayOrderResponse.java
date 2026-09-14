package com.omizoon.PaymentService.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RazorpayOrderResponse {

    private Long paymentId;

    private Long orderId;

    private String razorpayOrderId;

    private Double amount;

    private String currency;

    private String status;
}










