package com.omizoon.OrderService.repository;



import com.omizoon.OrderService.entity.CartEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartRepository extends JpaRepository<CartEntity, Long> {

    // Get complete cart of a user
    List<CartEntity> findByUserId(Long userId);

    // Find specific cake in user's cart
    Optional<CartEntity> findByUserIdAndCakeId(Long userId, Long cakeId);

    // Check whether cake already exists in user's cart
    boolean existsByUserIdAndCakeId(Long userId, Long cakeId);

    // Delete complete cart of a user
    void deleteByUserId(Long userId);
}