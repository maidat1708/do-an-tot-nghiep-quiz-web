package com.example.samuel_shop.Service;

public interface IKafkaProduceService {
    void sendMessage(String topic, Object object);
}
