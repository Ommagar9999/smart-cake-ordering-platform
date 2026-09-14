package com.omizoon.OrderService.controller;


import com.omizoon.OrderService.dto.ReviewRequest;
import com.omizoon.OrderService.dto.ReviewResponse;

import com.omizoon.OrderService.service.ReviewService;
import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;


    // =====================================================
    // CREATE REVIEW
    // =====================================================

    @PostMapping
    public ResponseEntity<ReviewResponse> createReview(
            @Valid @RequestBody ReviewRequest request) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        reviewService.createReview(request)
                );
    }


    // =====================================================
    // GET REVIEW BY ID
    // =====================================================

    @GetMapping("/{reviewId}")
    public ResponseEntity<ReviewResponse> getReviewById(
            @PathVariable Long reviewId) {

        return ResponseEntity.ok(
                reviewService.getReviewById(reviewId)
        );
    }


    // =====================================================
    // GET REVIEWS BY CAKE
    // =====================================================

    @GetMapping("/cake/{cakeId}")
    public ResponseEntity<List<ReviewResponse>> getReviewsByCake(
            @PathVariable Long cakeId) {

        return ResponseEntity.ok(
                reviewService.getReviewsByCake(cakeId)
        );
    }


    // =====================================================
    // GET REVIEWS BY USER
    // =====================================================

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ReviewResponse>> getReviewsByUser(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                reviewService.getReviewsByUser(userId)
        );
    }


    // =====================================================
    // DELETE REVIEW
    // =====================================================

    @DeleteMapping("/{reviewId}")
    public ResponseEntity<Void> deleteReview(
            @PathVariable Long reviewId) {

        reviewService.deleteReview(reviewId);

        return ResponseEntity.noContent().build();
    }



    @GetMapping("/cake/{cakeId}/average")
    public ResponseEntity<Double> getAverageRating(
            @PathVariable Long cakeId) {

        return ResponseEntity.ok(
                reviewService.getAverageRating(cakeId)
        );
    }


}
