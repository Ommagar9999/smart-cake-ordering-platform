package com.omizoon.deliveryService.repository;

import com.omizoon.deliveryService.entity.DeliveryEntity;
import com.omizoon.deliveryService.entity.DeliveryStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DeliveryRepository extends JpaRepository<DeliveryEntity,Long> {


    Optional<DeliveryEntity> findByOrderId(Long orderId);

    List<DeliveryEntity> findByDeliveryPersonId(Long deliveryPersonId);

    List<DeliveryEntity> findByStatus(DeliveryStatus status);



}



