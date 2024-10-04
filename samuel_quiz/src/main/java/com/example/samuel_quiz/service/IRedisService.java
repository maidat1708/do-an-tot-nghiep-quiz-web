package com.example.samuel_quiz.service;

public interface IRedisService {
    void saveValue(String key, Object value);
    Object getValue(String key);
    void delete(String key);
}
