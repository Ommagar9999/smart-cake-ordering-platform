package com.omizoon.CakeService.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CakeResponse {

    private Long id;

    private String name;

    private String description;

    private BigDecimal price;

    private String imageUrl;

    private String category;

    private Boolean available;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;



}