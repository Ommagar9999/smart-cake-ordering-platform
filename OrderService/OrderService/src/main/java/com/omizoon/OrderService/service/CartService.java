package com.omizoon.OrderService.service;


import com.omizoon.OrderService.dto.CartRequest;
import com.omizoon.OrderService.dto.CartResponse;

import java.util.List;

public interface CartService {

    CartResponse addToCart(CartRequest request);

    CartResponse updateCartItem(Long cartId, Integer quantity);

    List<CartResponse> getMyCart();

    void removeFromCart(Long cartId);

    void clearCart();
}