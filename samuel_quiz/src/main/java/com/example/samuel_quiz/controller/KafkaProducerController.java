package com.example.samuel_quiz.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.samuel_quiz.service.IKafkaProduceService;

import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;

@RestController
@RequestMapping("/kafka")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class KafkaProducerController {

    @Autowired
    IKafkaProduceService kafkaProducerService;

    @PostMapping("/send")
    public void sendMessage(@RequestBody String message) {
        kafkaProducerService.sendMessage("samuel_topic", message);
    }
}
