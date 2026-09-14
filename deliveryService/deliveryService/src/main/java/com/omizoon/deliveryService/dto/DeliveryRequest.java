package com.omizoon.deliveryService.dto;


import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DeliveryRequest {

    @NotNull(message = "Order ID is required")
    private Long orderId;

    @NotNull(message = "Delivery person ID is required")
    private Long deliveryPersonId;

    private String deliveryAddress;
}