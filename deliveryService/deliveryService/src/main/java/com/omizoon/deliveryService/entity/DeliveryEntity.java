package com.omizoon.deliveryService.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "deliveries")
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DeliveryEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private  Long id;
    private  Long orderId;

    private  Long deliveryPersonId;

    @Enumerated(EnumType.STRING)
    private  DeliveryStatus status;



    private String deliveryAddress;

    private  String otp;

    private  boolean otpVerified;

    private LocalDateTime assignedAt;

    private  LocalDateTime deliveredAt;

    private  LocalDateTime createdAt;

    private  LocalDateTime updatedAt;




}
