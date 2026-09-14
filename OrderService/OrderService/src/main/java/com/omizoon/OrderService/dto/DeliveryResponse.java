package com.omizoon.OrderService.dto;


import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DeliveryResponse {

    private Long id;

    private Long orderId;

    private Long deliveryPersonId;

    private DeliveryStatus status;

    private String deliveryAddress;

    private boolean otpVerified;
}