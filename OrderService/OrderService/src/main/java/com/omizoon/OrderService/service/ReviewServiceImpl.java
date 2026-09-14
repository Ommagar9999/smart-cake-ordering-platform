package com.omizoon.OrderService.service;


import com.omizoon.OrderService.client.UserClient;
import com.omizoon.OrderService.dto.ReviewRequest;
import com.omizoon.OrderService.dto.ReviewResponse;
import com.omizoon.OrderService.dto.UserResponse;
import com.omizoon.OrderService.entity.OrderEntity;
import com.omizoon.OrderService.entity.OrderStatus;
import com.omizoon.OrderService.entity.ReviewEntity;
import com.omizoon.OrderService.repository.OrderRepository;
import com.omizoon.OrderService.repository.ReviewRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {


    private final OrderRepository orderRepository;
    private final ReviewRepository reviewRepository;
    private final UserClient userClient;

    // =====================================================
    // CREATE REVIEW
    // =====================================================

    @Override
    @Transactional
    public ReviewResponse createReview(ReviewRequest request) {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        String email = authentication.getName();

        // Get actual userId from User Service
        Long userId = getUserIdFromAuthentication(email);


        // Find order
        OrderEntity order = orderRepository
                        .findById(request.getOrderId())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Order not found with id: "
                                                + request.getOrderId()
                                )
                        );


        // Review allowed only after delivery
        if (order.getStatus() != OrderStatus.DELIVERED) {

            throw new RuntimeException(
                    "You can review the cake only after delivery"
            );
        }


        // Check duplicate review
        if (reviewRepository
                .existsByUserIdAndCakeIdAndOrderId(
                        userId,
                        request.getCakeId(),
                        request.getOrderId()
                )) {

            throw new RuntimeException(
                    "You have already reviewed this cake for this order"
            );
        }


        // Create review
        ReviewEntity review =
                ReviewEntity.builder()
                        .userId(userId)
                        .cakeId(request.getCakeId())
                        .orderId(request.getOrderId())
                        .rating(request.getRating())
                        .comment(request.getComment())
                        .build();


        // Save review
        ReviewEntity savedReview =
                reviewRepository.save(review);


        // Convert Entity → Response
        return mapToResponse(savedReview);
    }


    // =====================================================
    // GET REVIEW BY ID
    // =====================================================

    @Override
    public ReviewResponse getReviewById(
            Long reviewId) {

        ReviewEntity review =
                getEntityById(reviewId);

        return mapToResponse(review);
    }


    // =====================================================
    // GET REVIEWS BY CAKE
    // =====================================================

    @Override
    public List<ReviewResponse> getReviewsByCake(
            Long cakeId) {

        return reviewRepository
                .findByCakeId(cakeId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }


    // =====================================================
    // GET REVIEWS BY USER
    // =====================================================

    @Override
    public List<ReviewResponse> getReviewsByUser(
            Long userId) {

        return reviewRepository
                .findByUserId(userId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }


    // =====================================================
    // DELETE REVIEW
    // =====================================================

    @Override
    @Transactional
    public void deleteReview(Long reviewId) {

        ReviewEntity review =
                getEntityById(reviewId);

        reviewRepository.delete(review);
    }


    // =====================================================
    // FIND ENTITY
    // =====================================================

    private ReviewEntity getEntityById(
            Long reviewId) {

        return reviewRepository
                .findById(reviewId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Review not found with id: "
                                        + reviewId
                        )
                );
    }


    // =====================================================
    // USER ID
    // =====================================================

    private Long getUserIdFromAuthentication(String email) {

        UserResponse userResponse = userClient.getUserByEmail(email);

        return userResponse.getId();
    }



    @Override
    public Double getAverageRating(Long cakeId) {

        Double average =
                reviewRepository.getAverageRatingByCakeId(cakeId);

        return average != null ? average : 0.0;
    }




    // =====================================================
    // ENTITY → RESPONSE
    // =====================================================

    private ReviewResponse mapToResponse(
            ReviewEntity review) {

        return ReviewResponse.builder()
                .id(review.getId())
                .userId(review.getUserId())
                .cakeId(review.getCakeId())
                .orderId(review.getOrderId())
                .rating(review.getRating())
                .comment(review.getComment())
                .createdAt(review.getCreatedAt())
                .updatedAt(review.getUpdatedAt())
                .build();
    }
}