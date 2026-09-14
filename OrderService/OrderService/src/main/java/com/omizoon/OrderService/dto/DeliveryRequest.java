package com.omizoon.OrderService.dto;


import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DeliveryRequest {

    private Long orderId;

    private Long deliveryPersonId;

    private String deliveryAddress;
}