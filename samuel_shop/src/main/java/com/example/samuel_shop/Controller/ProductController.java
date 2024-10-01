package com.example.samuel_shop.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.samuel_shop.DTO.Request.ProductRequest;
import com.example.samuel_shop.DTO.Response.APIResponse;
import com.example.samuel_shop.Entities.Product;
import com.example.samuel_shop.Service.IProductService;

import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;

import java.util.*;

@RestController
@RequestMapping("/products")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProductController {
    
    @Autowired
    IProductService productService;

    @PostMapping
    public APIResponse<Product> createProduct(@RequestBody ProductRequest product) {
        return APIResponse.<Product>builder()
                .result(productService.createProduct(product))
                .build();
    }

    @PutMapping("/{productId}")
    public APIResponse<Product> updateProduct(@PathVariable int productId, @RequestBody ProductRequest updatedProduct) {
        return APIResponse.<Product>builder()
                .result(productService.updateProduct(productId, updatedProduct))
                .build();
    }

    @DeleteMapping("/{productId}")
    public APIResponse<String> deleteProduct(@PathVariable int productId) {
        productService.deleteProduct(productId);
        return APIResponse.<String>builder()
                .result("Product has been deleted!")
                .build();
    }

    @GetMapping("/{productId}")
    public APIResponse<Product> getProductById(@PathVariable int productId) {
        return APIResponse.<Product>builder()
                .result(productService.getProductById(productId))
                .build();
    }

    @GetMapping
    public APIResponse<List<Product>> getAllProducts() {
        return APIResponse.<List<Product>>builder()
                .result(productService.getAllProducts())
                .build();
    }
}
