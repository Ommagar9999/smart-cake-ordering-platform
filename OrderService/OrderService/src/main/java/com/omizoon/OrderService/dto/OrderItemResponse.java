package com.omizoon.OrderService.dto;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItemResponse {

    private Long id;

    private Long cakeId;

    private String cakeName;

    private String imageUrl;

    private Integer quantity;

    private BigDecimal price;
}