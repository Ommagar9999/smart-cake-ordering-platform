package com.omizoon.OrderService.service;

import com.omizoon.OrderService.dto.OrderRequest;
import com.omizoon.OrderService.dto.OrderResponse;
import com.omizoon.OrderService.entity.OrderStatus;

import java.util.List;

public interface OrderService {

    OrderResponse createOrder(OrderRequest request);

    OrderResponse getOrderById(Long id);

    List<OrderResponse> getAllOrders();

    List<OrderResponse> getOrdersByUserId(Long userId);

    OrderResponse cancelOrder(Long id);

    OrderResponse updateOrderStatus(Long id, OrderStatus status);
}