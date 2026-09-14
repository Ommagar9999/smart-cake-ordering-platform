package com.omizoon.OrderService.service;

import com.omizoon.OrderService.client.CakeClient;
import com.omizoon.OrderService.client.UserClient;
import com.omizoon.OrderService.dto.CakeResponse;
import com.omizoon.OrderService.dto.CartRequest;
import com.omizoon.OrderService.dto.CartResponse;
import com.omizoon.OrderService.dto.UserResponse;
import com.omizoon.OrderService.entity.CartEntity;
import com.omizoon.OrderService.repository.CartRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;

    private final UserClient userClient;

    private final CakeClient cakeClient;


    // =====================================================
    // ADD TO CART
    // =====================================================

    @Override
    @Transactional
    public CartResponse addToCart(CartRequest request) {

        Long userId = getCurrentUserId();

        // =================================================
        // CHECK EXISTING CART ITEM
        // =================================================

        CartEntity existingItem =
                cartRepository
                        .findByUserIdAndCakeId(
                                userId,
                                request.getCakeId()
                        )
                        .orElse(null);


        // =================================================
        // EXISTING ITEM -> INCREASE QUANTITY
        // =================================================

        if (existingItem != null) {

            int newQuantity =
                    existingItem.getQuantity()
                            + request.getQuantity();

            existingItem.setQuantity(newQuantity);

            existingItem.setTotalPrice(
                    existingItem.getPrice()
                            .multiply(
                                    BigDecimal.valueOf(newQuantity)
                            )
            );

            return mapToResponse(
                    cartRepository.save(existingItem)
            );
        }


        // =================================================
        // GET CAKE FROM CAKE SERVICE
        // =================================================

        CakeResponse cake =
                cakeClient.getCakeById(
                        request.getCakeId()
                );


        if (cake == null) {

            throw new RuntimeException(
                    "Cake not found with id: "
                            + request.getCakeId()
            );
        }


        // =================================================
        // CHECK CAKE AVAILABILITY
        // =================================================

        if (Boolean.FALSE.equals(cake.getAvailable())) {

            throw new RuntimeException(
                    "Cake is currently unavailable"
            );
        }


        // =================================================
        // GET CAKE PRICE
        // =================================================

        BigDecimal price = cake.getPrice();


        if (price == null) {

            throw new RuntimeException(
                    "Cake price is not available"
            );
        }


        // =================================================
        // CHECK QUANTITY
        // =================================================

        if (request.getQuantity() == null ||
                request.getQuantity() < 1) {

            throw new RuntimeException(
                    "Quantity must be at least 1"
            );
        }


        // =================================================
        // CALCULATE TOTAL PRICE
        // =================================================

        BigDecimal totalPrice =
                price.multiply(
                        BigDecimal.valueOf(
                                request.getQuantity()
                        )
                );


        // =================================================
        // CREATE CART ENTITY
        // =================================================

        CartEntity cart =
                CartEntity.builder()
                        .userId(userId)
                        .cakeId(request.getCakeId())
                        .quantity(request.getQuantity())
                        .price(price)
                        .totalPrice(totalPrice)
                        .build();


        // =================================================
        // SAVE CART ITEM
        // =================================================

        CartEntity savedCart =
                cartRepository.save(cart);


        return mapToResponse(savedCart);
    }


    // =====================================================
    // UPDATE CART ITEM
    // =====================================================

    @Override
    @Transactional
    public CartResponse updateCartItem(
            Long cartId,
            Integer quantity) {

        CartEntity cart =
                getCartItemById(cartId);


        Long userId =
                getCurrentUserId();


        // =================================================
        // CHECK CART OWNERSHIP
        // =================================================

        if (!cart.getUserId().equals(userId)) {

            throw new RuntimeException(
                    "You cannot update another user's cart"
            );
        }


        // =================================================
        // VALIDATE QUANTITY
        // =================================================

        if (quantity == null || quantity < 1) {

            throw new RuntimeException(
                    "Quantity must be at least 1"
            );
        }


        // =================================================
        // UPDATE QUANTITY
        // =================================================

        cart.setQuantity(quantity);


        // =================================================
        // RECALCULATE TOTAL PRICE
        // =================================================

        cart.setTotalPrice(
                cart.getPrice()
                        .multiply(
                                BigDecimal.valueOf(quantity)
                        )
        );


        return mapToResponse(
                cartRepository.save(cart)
        );
    }


    // =====================================================
    // GET MY CART
    // =====================================================

    @Override
    public List<CartResponse> getMyCart() {

        Long userId =
                getCurrentUserId();


        return cartRepository
                .findByUserId(userId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }


    // =====================================================
    // REMOVE FROM CART
    // =====================================================

    @Override
    @Transactional
    public void removeFromCart(Long cartId) {

        CartEntity cart =
                getCartItemById(cartId);


        Long userId =
                getCurrentUserId();


        // =================================================
        // CHECK CART OWNERSHIP
        // =================================================

        if (!cart.getUserId().equals(userId)) {

            throw new RuntimeException(
                    "You cannot remove another user's cart item"
            );
        }


        cartRepository.delete(cart);
    }


    // =====================================================
    // CLEAR CART
    // =====================================================

    @Override
    @Transactional
    public void clearCart() {

        Long userId =
                getCurrentUserId();


        cartRepository.deleteByUserId(userId);
    }


    // =====================================================
    // GET CURRENT USER ID
    // =====================================================

    private Long getCurrentUserId() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();


        // =================================================
        // CHECK AUTHENTICATION
        // =================================================

        if (authentication == null ||
                !authentication.isAuthenticated()) {

            throw new RuntimeException(
                    "User is not authenticated"
            );
        }


        // =================================================
        // GET EMAIL FROM JWT
        // =================================================

        String email =
                authentication.getName();


        if (email == null || email.isBlank()) {

            throw new RuntimeException(
                    "User email not found in authentication"
            );
        }


        // =================================================
        // GET USER FROM USER SERVICE
        // =================================================

        UserResponse userResponse =
                userClient.getUserByEmail(email);


        // =================================================
        // CHECK USER
        // =================================================

        if (userResponse == null) {

            throw new RuntimeException(
                    "User not found with email: "
                            + email
            );
        }


        if (userResponse.getId() == null) {

            throw new RuntimeException(
                    "User ID not found for email: "
                            + email
            );
        }


        return userResponse.getId();
    }


    // =====================================================
    // FIND CART ITEM BY ID
    // =====================================================

    private CartEntity getCartItemById(Long cartId) {

        return cartRepository
                .findById(cartId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Cart item not found with id: "
                                        + cartId
                        )
                );
    }


    // =====================================================
    // ENTITY -> RESPONSE
    // GET CAKE DETAILS FROM CAKE SERVICE
    // =====================================================

    private CartResponse mapToResponse(
            CartEntity cart) {

        CakeResponse cake = null;

        try {

            cake =
                    cakeClient.getCakeById(
                            cart.getCakeId()
                    );

        } catch (Exception e) {

            System.out.println(
                    "Unable to fetch cake details for cakeId: "
                            + cart.getCakeId()
            );
        }


        // =================================================
        // BUILD CART RESPONSE
        // =================================================

        CartResponse.CartResponseBuilder response =
                CartResponse.builder()
                        .id(cart.getId())
                        .userId(cart.getUserId())
                        .cakeId(cart.getCakeId())
                        .quantity(cart.getQuantity())
                        .price(cart.getPrice())
                        .totalPrice(cart.getTotalPrice())
                        .createdAt(cart.getCreatedAt())
                        .updatedAt(cart.getUpdatedAt());


        // =================================================
        // ADD CAKE DETAILS
        // =================================================

        if (cake != null) {

            response
                    .cakeName(cake.getName())
                    .cakeDescription(cake.getDescription())
                    .imageUrl(cake.getImageUrl());
        }


        // =================================================
        // FINAL RESPONSE
        // =================================================

        return response.build();
    }
}