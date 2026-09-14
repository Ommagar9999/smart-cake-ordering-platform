package com.omizoon.OrderService.client;

import com.omizoon.OrderService.dto.DeliveryRequest;
import com.omizoon.OrderService.dto.DeliveryResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

@FeignClient(name = "deliveryService")
public interface DeliveryClient {

    @PostMapping("/api/deliveries")
    DeliveryResponse createDelivery(
            @RequestBody DeliveryRequest request
    );

    @GetMapping("/api/deliveries/order/{orderId}")
    DeliveryResponse getDeliveryByOrderId(
            @PathVariable("orderId") Long orderId
    );
}