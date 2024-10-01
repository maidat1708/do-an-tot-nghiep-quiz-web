package com.example.samuel_shop.Service.Impl;

import java.util.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;

import com.example.samuel_shop.DTO.Request.ProductRequest;
import com.example.samuel_shop.Entities.Product;
import com.example.samuel_shop.Mapper.ProductMapper;
import com.example.samuel_shop.Repository.ProductRepository;
import com.example.samuel_shop.Service.IKafkaProduceService;
import com.example.samuel_shop.Service.IProductService;

import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProductService implements IProductService {

    @Autowired
    ProductRepository productRepository;

    @Autowired
    RedisService redisService; // Inject RedisService

    @Autowired
    ProductMapper productMapper;

    @Autowired
    IKafkaProduceService kafkaProducerService;

    @Autowired
    Environment environment;

    private static final String REDIS_KEY = "allProducts_Samuel";

    @Override
    @Transactional
    public Product createProduct(ProductRequest request) {
        clearProductCache(); // Clear cache when a new product is added
        Product product = productRepository.save(productMapper.toProduct(request));
        String createProduct = environment.getProperty("kafka.topics.create-product");
        kafkaProducerService.sendMessage(createProduct, productMapper.tProductKafkaRequest(product));
        // productESRepository.save(productMapper.toProductDocument(product));
        return product;
    }

    @Override
    @Transactional
    public Product updateProduct(int id, ProductRequest updatedProduct) {
        clearProductCache(); // Clear cache when a product is updated
        Optional<Product> existingProduct = productRepository.findById(id);
        if (existingProduct.isPresent()) {
            productMapper.updateProduct(existingProduct.get(), updatedProduct);
            String updateProduct = environment.getProperty("kafka.topics.update-product");
            kafkaProducerService.sendMessage(updateProduct, productMapper.tProductKafkaRequest(existingProduct.get()));
            // productESRepository.save(productMapper.toProductDocument(existingProduct.get()));
            return productRepository.save(existingProduct.get());
        } else {
            throw new RuntimeException("Product not found with id: " + id);
        }
    }

    @Override
    @Transactional
    public void deleteProduct(int id) { 
        clearProductCache(); // Clear cache when a product is deleted
        // productESRepository.deleteById(id);
        String deleteProduct = environment.getProperty("kafka.topics.delete-product");
        kafkaProducerService.sendMessage(deleteProduct,String.valueOf(id));
        productRepository.deleteById(id);
    }

    @Override
    public Product getProductById(int id) {
        clearProductCache();
        Product product = productRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
        kafkaProducerService.sendMessage("samuel_topic", String.valueOf(id));
        return product;
    }

    @SuppressWarnings("unchecked")
    @Override
    public List<Product> getAllProducts() {
        // Check if the data is in Redis
        List<Product> products = (List<Product>) redisService.getValue(REDIS_KEY);
        if (products == null) {
            // If not, retrieve from the database and cache it
            products = productRepository.findAll();
            redisService.saveValue(REDIS_KEY, products);
        }
        return products;
    }

    private void clearProductCache() {
        redisService.delete(REDIS_KEY); // Clear cache after any update
    }
}
