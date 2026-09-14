package com.omizoon.CakeService.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "cake")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class CakeEntity {
   @Id
   @GeneratedValue(strategy = GenerationType.IDENTITY)
   private  Long id;

   @Column(nullable = false)
   private  String name;

   @Column(length = 1000)
   private  String description;

   @Column(nullable = false,precision = 10,scale = 2)
   private BigDecimal price;

   @Builder.Default
   private  boolean  available = true;


   private  String imageUrl;

   @Column(nullable = false)
   private String category;

   @CreationTimestamp
   @Column(updatable = false)
   private LocalDateTime createdAt;

   @UpdateTimestamp
   private LocalDateTime updatedAt;


   public Boolean getAvailable() {
      return available;
   }


   public void setAvailable(Boolean available) {
      this.available = available;
   }
}
