package com.omizoon.PaymentService.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentEvent {

    private Long paymentId;

    private Long orderId;

    private Long userId;

    private Double amount;

    private String currency;

    private String status;

    private LocalDateTime paymentTime;
}
