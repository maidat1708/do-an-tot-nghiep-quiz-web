package com.example.samuel_shop.Service.Impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import com.example.samuel_shop.Service.IKafkaProduceService;

import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE)
public class KafkaProducerService implements IKafkaProduceService{

    @Autowired
    KafkaTemplate<String, Object> kafkaTemplate;


    @Override
    public void sendMessage(String topic, Object object) {
        kafkaTemplate.send(topic, object);
    }

}

