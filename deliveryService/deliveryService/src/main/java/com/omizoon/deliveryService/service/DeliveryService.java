package com.omizoon.deliveryService.service;




import com.omizoon.deliveryService.dto.DeliveryRequest;
import com.omizoon.deliveryService.dto.DeliveryResponse;

import java.util.List;

public interface DeliveryService {

    DeliveryResponse assignDelivery(DeliveryRequest request);

    DeliveryResponse startDelivery(Long deliveryId);

    DeliveryResponse verifyOtp(Long deliveryId, String otp);

    DeliveryResponse getDeliveryById(Long deliveryId);

    DeliveryResponse getDeliveryByOrderId(Long orderId);

    List<DeliveryResponse> getDeliveriesByPerson(Long deliveryPersonId);
}


