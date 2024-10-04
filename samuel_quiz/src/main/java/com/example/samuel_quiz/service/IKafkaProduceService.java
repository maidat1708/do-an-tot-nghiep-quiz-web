package com.example.samuel_quiz.service;

public interface IKafkaProduceService {
    void sendMessage(String topic, Object object);
}
