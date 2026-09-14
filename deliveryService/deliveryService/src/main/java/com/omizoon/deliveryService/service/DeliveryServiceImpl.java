package com.omizoon.deliveryService.service;

import com.omizoon.deliveryService.dto.DeliveryRequest;
import com.omizoon.deliveryService.dto.DeliveryResponse;
import com.omizoon.deliveryService.entity.DeliveryEntity;
import com.omizoon.deliveryService.entity.DeliveryStatus;
import com.omizoon.deliveryService.repository.DeliveryRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class DeliveryServiceImpl implements DeliveryService {

    private final DeliveryRepository deliveryRepository;


    // =====================================================
    // ASSIGN DELIVERY
    // =====================================================

    @Override
    @Transactional
    public DeliveryResponse assignDelivery( DeliveryRequest request) {

        if (deliveryRepository
                .findByOrderId(request.getOrderId())
                .isPresent()) {

            throw new RuntimeException(
                    "Delivery already exists for order: " + request.getOrderId()
            );
        }

        String otp = generateOtp();

        DeliveryEntity delivery =  DeliveryEntity.builder()
                        .orderId(request.getOrderId())

                        .deliveryPersonId(request.getDeliveryPersonId())

                        .deliveryAddress(request.getDeliveryAddress())
                        .status(
                                DeliveryStatus.ASSIGNED
                        )
                        .otp(otp)
                        .otpVerified(false)
                        .assignedAt(LocalDateTime.now() )
                        .build();

        DeliveryEntity savedDelivery = deliveryRepository.save(delivery);

        return mapToResponse(savedDelivery);
    }


    // =====================================================
    // START DELIVERY
    // =====================================================

    @Override
    @Transactional
    public DeliveryResponse startDelivery(
            Long deliveryId) {

        DeliveryEntity delivery =  getEntityById(deliveryId);

        if (delivery.getStatus() != DeliveryStatus.ASSIGNED) {

            throw new RuntimeException("Delivery cannot be started");
        }

        delivery.setStatus( DeliveryStatus.OUT_FOR_DELIVERY );

        DeliveryEntity updatedDelivery =  deliveryRepository.save(delivery);

        return mapToResponse(updatedDelivery);
    }


    // =====================================================
    // VERIFY OTP
    // =====================================================

    @Override
    @Transactional
    public DeliveryResponse verifyOtp(Long deliveryId, String otp) {

        DeliveryEntity delivery =
                getEntityById(deliveryId);

        if (delivery.isOtpVerified()) {

            throw new RuntimeException(
                    "OTP already verified"
            );
        }

        if (!delivery.getOtp().equals(otp)) {

            throw new RuntimeException(
                    "Invalid OTP"
            );
        }

        delivery.setOtpVerified(true);

        delivery.setStatus(
                DeliveryStatus.DELIVERED
        );

        delivery.setDeliveredAt(
                LocalDateTime.now()
        );

        DeliveryEntity updatedDelivery =
                deliveryRepository.save(delivery);

        return mapToResponse(updatedDelivery);
    }


    // =====================================================
    // GET DELIVERY BY ID
    // =====================================================

    @Override
    public DeliveryResponse getDeliveryById(
            Long deliveryId) {

        return mapToResponse(
                getEntityById(deliveryId)
        );
    }


    // =====================================================
    // GET DELIVERY BY ORDER ID
    // =====================================================

    @Override
    public DeliveryResponse getDeliveryByOrderId(
            Long orderId) {

        DeliveryEntity delivery =
                deliveryRepository
                        .findByOrderId(orderId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Delivery not found for order: "
                                                + orderId
                                )
                        );

        return mapToResponse(delivery);
    }


    // =====================================================
    // GET DELIVERIES BY DELIVERY PERSON
    // =====================================================

    @Override
    public List<DeliveryResponse> getDeliveriesByPerson(
            Long deliveryPersonId) {

        return deliveryRepository
                .findByDeliveryPersonId(
                        deliveryPersonId
                )
                .stream()
                .map(this::mapToResponse)
                .toList();
    }


    // =====================================================
    // FIND ENTITY
    // =====================================================

    private DeliveryEntity getEntityById(
            Long deliveryId) {

        return deliveryRepository
                .findById(deliveryId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Delivery not found with id: "
                                        + deliveryId
                        )
                );
    }


    // =====================================================
    // GENERATE OTP
    // =====================================================

    private String generateOtp() {

        return String.valueOf(
                1000 + new Random().nextInt(9000)
        );
    }


    // =====================================================
    // ENTITY → RESPONSE
    // =====================================================

    private DeliveryResponse mapToResponse(
            DeliveryEntity delivery) {

        return DeliveryResponse.builder()
                .id(delivery.getId())
                .orderId(delivery.getOrderId())
                .deliveryPersonId(
                        delivery.getDeliveryPersonId()
                )
                .status(delivery.getStatus())
                .deliveryAddress(
                        delivery.getDeliveryAddress()
                )
                .otpVerified(
                        delivery.isOtpVerified()
                )
                .assignedAt(
                        delivery.getAssignedAt()
                )
                .deliveredAt(
                        delivery.getDeliveredAt()
                )
                .createdAt(
                        delivery.getCreatedAt()
                )
                .updatedAt(
                        delivery.getUpdatedAt()
                )
                .build();
    }
}