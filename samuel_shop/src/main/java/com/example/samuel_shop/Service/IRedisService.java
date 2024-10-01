package com.example.samuel_shop.Service;

public interface IRedisService {
    void saveValue(String key, Object value);
    Object getValue(String key);
    void delete(String key);
}
