package com.omizoon.deliveryService.controller;

import com.omizoon.deliveryService.dto.DeliveryRequest;
import com.omizoon.deliveryService.dto.DeliveryResponse;
import com.omizoon.deliveryService.service.DeliveryService;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/deliveries")
@RequiredArgsConstructor
public class DeliveryController {

    private final DeliveryService deliveryService;


    // =====================================================
    // ASSIGN DELIVERY
    // =====================================================

    @PostMapping
    public ResponseEntity<DeliveryResponse> assignDelivery(
            @Valid @RequestBody DeliveryRequest request) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        deliveryService.assignDelivery(request)
                );
    }


    // =====================================================
    // START DELIVERY
    // =====================================================

    @PutMapping("/{deliveryId}/start")
    public ResponseEntity<DeliveryResponse> startDelivery(
            @PathVariable Long deliveryId) {

        return ResponseEntity.ok(
                deliveryService.startDelivery(
                        deliveryId
                )
        );
    }


    // =====================================================
    // VERIFY OTP / COMPLETE DELIVERY
    // =====================================================

    @PutMapping("/{deliveryId}/verify-otp")
    public ResponseEntity<DeliveryResponse> verifyOtp(
            @PathVariable Long deliveryId,
            @RequestParam String otp) {

        return ResponseEntity.ok(
                deliveryService.verifyOtp(
                        deliveryId,
                        otp
                )
        );
    }


    // =====================================================
    // GET DELIVERY BY ID
    // =====================================================

    @GetMapping("/{deliveryId}")
    public ResponseEntity<DeliveryResponse> getDeliveryById(
            @PathVariable Long deliveryId) {

        return ResponseEntity.ok(
                deliveryService.getDeliveryById(
                        deliveryId
                )
        );
    }


    // =====================================================
    // GET DELIVERY BY ORDER ID
    // =====================================================

    @GetMapping("/order/{orderId}")
    public ResponseEntity<DeliveryResponse> getDeliveryByOrderId(
            @PathVariable Long orderId) {

        return ResponseEntity.ok(
                deliveryService.getDeliveryByOrderId(
                        orderId
                )
        );
    }


    // =====================================================
    // GET DELIVERIES BY DELIVERY PERSON
    // =====================================================

    @GetMapping("/person/{deliveryPersonId}")
    public ResponseEntity<List<DeliveryResponse>> getDeliveriesByPerson(
            @PathVariable Long deliveryPersonId) {

        return ResponseEntity.ok(
                deliveryService.getDeliveriesByPerson(
                        deliveryPersonId
                )
        );
    }
}