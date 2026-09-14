package com.omizoon.OrderService.entity;



import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "cart_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // User who owns this cart item
    @Column(nullable = false)
    private Long userId;

    // Cake from Cake Service
    @Column(nullable = false)
    private Long cakeId;

    // Quantity of cake
    @Column(nullable = false)
    private Integer quantity;

    // Price when item was added
    @Column(nullable = false)
    private BigDecimal price;

    // Quantity × price
    @Column(nullable = false)
    private BigDecimal totalPrice;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;


    @PrePersist
    protected void onCreate() {

        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }


    @PreUpdate
    protected void onUpdate() {

        updatedAt = LocalDateTime.now();
    }
}