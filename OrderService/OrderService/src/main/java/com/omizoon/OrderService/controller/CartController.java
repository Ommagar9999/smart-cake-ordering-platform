package com.omizoon.OrderService.controller;


import com.omizoon.OrderService.dto.CartRequest;
import com.omizoon.OrderService.dto.CartResponse;
import com.omizoon.OrderService.service.CartService;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;


    // =====================================================
    // ADD TO CART
    // =====================================================

    @PostMapping
    public ResponseEntity<CartResponse> addToCart(
            @Valid @RequestBody CartRequest request) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        cartService.addToCart(request)
                );
    }


    // =====================================================
    // GET MY CART
    // =====================================================

    @GetMapping
    public ResponseEntity<List<CartResponse>> getMyCart() {

        return ResponseEntity.ok(
                cartService.getMyCart()
        );
    }


    // =====================================================
    // UPDATE CART ITEM
    // =====================================================

    @PutMapping("/{cartId}")
    public ResponseEntity<CartResponse> updateCartItem(
            @PathVariable Long cartId,
            @RequestParam Integer quantity) {

        return ResponseEntity.ok(
                cartService.updateCartItem(
                        cartId,
                        quantity
                )
        );
    }


    // =====================================================
    // REMOVE FROM CART
    // =====================================================

    @DeleteMapping("/{cartId}")
    public ResponseEntity<Void> removeFromCart(
            @PathVariable Long cartId) {

        cartService.removeFromCart(cartId);

        return ResponseEntity.noContent().build();
    }


    // =====================================================
    // CLEAR CART
    // =====================================================

    @DeleteMapping
    public ResponseEntity<Void> clearCart() {

        cartService.clearCart();

        return ResponseEntity.noContent().build();
    }
}