package com.omizoon.PaymentService.kafka;

import com.omizoon.PaymentService.dto.PaymentEvent;

import lombok.RequiredArgsConstructor;

import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PaymentKafkaProducer {

    private static final String TOPIC = "payment-success";

    private final KafkaTemplate<String, PaymentEvent> kafkaTemplate;

    public void sendPaymentSuccess(PaymentEvent event
    ) {

        kafkaTemplate.send(
                TOPIC,
                event.getOrderId().toString(),
                event
        );

        System.out.println(
                "Payment success event sent to Kafka: " + event.getOrderId()
        );
    }
}
