package com.omizoon.OrderService.dto;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartResponse {

    private Long id;

    private Long userId;

    private Long cakeId;

    private Integer quantity;

    private BigDecimal price;

    private BigDecimal totalPrice;

    private String cakeName;

    private String cakeDescription;

    private String imageUrl;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}