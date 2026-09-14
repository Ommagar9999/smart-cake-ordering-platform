package com.omizoon.OrderService.service;

import com.omizoon.OrderService.client.CakeClient;
import com.omizoon.OrderService.client.UserClient;

import com.omizoon.OrderService.dto.CakeResponse;
import com.omizoon.OrderService.dto.OrderItemRequest;
import com.omizoon.OrderService.dto.OrderItemResponse;
import com.omizoon.OrderService.dto.OrderRequest;
import com.omizoon.OrderService.dto.OrderResponse;
import com.omizoon.OrderService.dto.UserResponse;

import com.omizoon.OrderService.entity.OrderEntity;
import com.omizoon.OrderService.entity.OrderItemEntity;
import com.omizoon.OrderService.entity.OrderStatus;

import com.omizoon.OrderService.repository.CartRepository;
import com.omizoon.OrderService.repository.OrderRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final CakeClient cakeClient;
    private final UserClient userClient;


    // =========================================================
    // CREATE ORDER
    // =========================================================

    @Override
    @Transactional
    public OrderResponse createOrder(OrderRequest request) {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        if (authentication == null ||
                !authentication.isAuthenticated()) {

            throw new RuntimeException(
                    "User is not authenticated"
            );
        }

        String email = authentication.getName();


        // =====================================================
        // GET USER FROM USER SERVICE
        // =====================================================

        UserResponse user =
                userClient.getUserByEmail(email);

        if (user == null ||
                user.getId() == null) {

            throw new RuntimeException(
                    "User not found with email: " + email
            );
        }

        Long userId = user.getId();


        // =====================================================
        // VALIDATE ITEMS
        // =====================================================

        if (request.getItems() == null ||
                request.getItems().isEmpty()) {

            throw new RuntimeException(
                    "Order must contain at least one item"
            );
        }


        // =====================================================
        // CREATE ORDER
        // =====================================================

        OrderEntity order =
                OrderEntity.builder()
                        .userId(userId)
                        .deliveryDate(request.getDeliveryDate())
                        .deliveryType(
                                request.getDeliveryType() != null
                                        ? request.getDeliveryType()
                                        : "NOW"
                        )
                        .deliveryTime(
                                request.getDeliveryTime() != null
                                        ? request.getDeliveryTime()
                                        : "ASAP"
                        )
                        .status(OrderStatus.PENDING)
                        .totalAmount(BigDecimal.ZERO)
                        .build();


        BigDecimal totalAmount = BigDecimal.ZERO;


        // =====================================================
        // PROCESS ORDER ITEMS
        // =====================================================

        for (OrderItemRequest itemRequest :
                request.getItems()) {

            if (itemRequest.getCakeId() == null) {

                throw new RuntimeException(
                        "Cake ID is required"
                );
            }

            if (itemRequest.getQuantity() == null ||
                    itemRequest.getQuantity() < 1) {

                throw new RuntimeException(
                        "Quantity must be at least 1"
                );
            }


            // =================================================
            // GET CAKE FROM CAKE SERVICE
            // =================================================

            CakeResponse cake;

            try {

                cake =
                        cakeClient.getCakeById(
                                itemRequest.getCakeId()
                        );

            } catch (Exception e) {

                throw new RuntimeException(
                        "Unable to fetch cake with id: "
                                + itemRequest.getCakeId()
                );
            }


            if (cake == null) {

                throw new RuntimeException(
                        "Cake not found with id: "
                                + itemRequest.getCakeId()
                );
            }


            // =================================================
            // CHECK CAKE AVAILABILITY
            // =================================================

            if (!Boolean.TRUE.equals(
                    cake.getAvailable()
            )) {

                throw new RuntimeException(
                        "Cake is not available: "
                                + cake.getName()
                );
            }


            // =================================================
            // GET CAKE PRICE
            // =================================================

            BigDecimal price = cake.getPrice();

            if (price == null ||
                    price.compareTo(BigDecimal.ZERO) <= 0) {

                throw new RuntimeException(
                        "Invalid cake price for cake id: "
                                + cake.getId()
                );
            }


            // =================================================
            // CREATE ORDER ITEM
            // =================================================

            OrderItemEntity item =
                    OrderItemEntity.builder()
                            .cakeId(cake.getId())
                            .quantity(itemRequest.getQuantity())
                            .price(price)
                            .order(order)
                            .build();

            order.getItems().add(item);


            // =================================================
            // CALCULATE ITEM TOTAL
            // =================================================

            BigDecimal itemTotal =
                    price.multiply(
                            BigDecimal.valueOf(
                                    itemRequest.getQuantity()
                            )
                    );

            totalAmount =
                    totalAmount.add(itemTotal);
        }


        // =====================================================
        // SET FINAL TOTAL
        // =====================================================

        order.setTotalAmount(totalAmount);


        // =====================================================
        // SAVE ORDER
        // =====================================================

        OrderEntity savedOrder =
                orderRepository.save(order);


        // =====================================================
        // CLEAR CART
        // =====================================================

        cartRepository.deleteByUserId(userId);


        // =====================================================
        // RETURN RESPONSE
        // =====================================================

        return mapToResponse(savedOrder);
    }


    // =========================================================
    // GET ORDER BY ID
    // =========================================================

    @Override
    public OrderResponse getOrderById(Long id) {

        OrderEntity order =
                orderRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Order not found with id: "
                                                + id
                                )
                        );

        return mapToResponse(order);
    }


    // =========================================================
    // GET ALL ORDERS
    // ADMIN
    // =========================================================

    @Override
    public List<OrderResponse> getAllOrders() {

        return orderRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }


    // =========================================================
    // GET ORDERS BY USER
    // =========================================================

    @Override
    public List<OrderResponse> getOrdersByUserId(
            Long userId
    ) {

        return orderRepository
                .findByUserId(userId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }


    // =========================================================
    // CANCEL ORDER
    // =========================================================

    @Override
    @Transactional
    public OrderResponse cancelOrder(Long id) {

        OrderEntity order =
                orderRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Order not found with id: "
                                                + id
                                )
                        );


        // Delivered order cannot be cancelled

        if (order.getStatus() ==
                OrderStatus.DELIVERED) {

            throw new RuntimeException(
                    "Delivered order cannot be cancelled"
            );
        }


        // Already cancelled

        if (order.getStatus() ==
                OrderStatus.CANCELLED) {

            throw new RuntimeException(
                    "Order is already cancelled"
            );
        }


        order.setStatus(
                OrderStatus.CANCELLED
        );


        OrderEntity updatedOrder =
                orderRepository.save(order);

        return mapToResponse(updatedOrder);
    }


    // =========================================================
    // UPDATE ORDER STATUS
    // ADMIN
    // =========================================================

    @Override
    @Transactional
    public OrderResponse updateOrderStatus(
            Long id,
            OrderStatus status
    ) {

        // =====================================================
        // FIND ORDER
        // =====================================================

        OrderEntity order =
                orderRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Order not found with id: "
                                                + id
                                )
                        );


        // =====================================================
        // VALIDATE STATUS
        // =====================================================

        if (status == null) {

            throw new RuntimeException(
                    "Order status is required"
            );
        }


        // =====================================================
        // CANCELLED ORDER
        // =====================================================

        if (order.getStatus() ==
                OrderStatus.CANCELLED) {

            throw new RuntimeException(
                    "Cancelled order status cannot be changed"
            );
        }


        // =====================================================
        // DELIVERED ORDER
        // =====================================================

        if (order.getStatus() ==
                OrderStatus.DELIVERED) {

            throw new RuntimeException(
                    "Delivered order status cannot be changed"
            );
        }


        // =====================================================
        // SAME STATUS CHECK
        // =====================================================

        if (order.getStatus() == status) {

            return mapToResponse(order);
        }


        // =====================================================
        // UPDATE STATUS
        // =====================================================

        order.setStatus(status);


        // =====================================================
        // SAVE
        // =====================================================

        OrderEntity updatedOrder =
                orderRepository.save(order);


        // =====================================================
        // RETURN UPDATED ORDER
        // =====================================================

        return mapToResponse(updatedOrder);
    }


    // =========================================================
    // ENTITY → RESPONSE
    // =========================================================

    private OrderResponse mapToResponse(
            OrderEntity order
    ) {

        List<OrderItemResponse> items =
                order.getItems()
                        .stream()
                        .map(item -> {

                            CakeResponse cake = null;

                            try {

                                cake =
                                        cakeClient.getCakeById(
                                                item.getCakeId()
                                        );

                            } catch (Exception e) {

                                System.out.println(
                                        "Unable to fetch cake details for cakeId: "
                                                + item.getCakeId()
                                );
                            }


                            return OrderItemResponse.builder()

                                    .id(
                                            item.getId()
                                    )

                                    .cakeId(
                                            item.getCakeId()
                                    )

                                    .cakeName(
                                            cake != null
                                                    ? cake.getName()
                                                    : "Cake #" +
                                                    item.getCakeId()
                                    )

                                    .imageUrl(
                                            cake != null
                                                    ? cake.getImageUrl()
                                                    : null
                                    )

                                    .quantity(
                                            item.getQuantity()
                                    )

                                    .price(
                                            item.getPrice()
                                    )

                                    .build();

                        })
                        .toList();


        // =====================================================
        // ORDER RESPONSE
        // =====================================================

        return OrderResponse.builder()

                .id(
                        order.getId()
                )

                .userId(
                        order.getUserId()
                )

                .totalAmount(
                        order.getTotalAmount()
                )

                .status(
                        order.getStatus()
                )

                .deliveryDate(
                        order.getDeliveryDate()
                )

                .deliveryType(
                        order.getDeliveryType()
                )

                .deliveryTime(
                        order.getDeliveryTime()
                )

                .items(
                        items
                )

                .createdAt(
                        order.getCreatedAt()
                )

                .updatedAt(
                        order.getUpdatedAt()
                )

                .build();
    }
}