package com.omizoon.OrderService.service;

import com.omizoon.OrderService.dto.ReviewRequest;
import com.omizoon.OrderService.dto.ReviewResponse;

import java.util.List;

public interface ReviewService {

    ReviewResponse createReview(ReviewRequest request);

    ReviewResponse getReviewById(Long reviewId);

    List<ReviewResponse> getReviewsByCake(Long cakeId);

    List<ReviewResponse> getReviewsByUser(Long userId);

    void deleteReview(Long reviewId);
    Double getAverageRating(Long cakeId);

}
