package com.omizoon.deliveryService.dto;

import com.omizoon.deliveryService.entity.DeliveryStatus;
import lombok.*;

import java.time.LocalDateTime;

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

    private LocalDateTime assignedAt;

    private LocalDateTime deliveredAt;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}