package com.omizoon.OrderService.repository;


import com.omizoon.OrderService.entity.ReviewEntity;
import feign.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<ReviewEntity, Long> {

    Optional<ReviewEntity> findByUserIdAndCakeIdAndOrderId(Long userId, Long cakeId, Long orderId);

    List<ReviewEntity> findByCakeId(Long cakeId);

    List<ReviewEntity> findByUserId(Long userId);

    List<ReviewEntity> findByOrderId(Long orderId);

    boolean existsByUserIdAndCakeIdAndOrderId(Long userId, Long cakeId, Long orderId);

    @Query("""
  SELECT AVG(r.rating)
        FROM ReviewEntity r
        WHERE r.cakeId = :cakeId
        """)
    Double getAverageRatingByCakeId(
            @Param("cakeId") Long cakeId
    );

}