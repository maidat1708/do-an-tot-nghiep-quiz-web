package com.example.samuel_shop.Service;

import java.util.List;

import com.example.samuel_shop.DTO.Request.ProductRequest;
import com.example.samuel_shop.Entities.Product;

public interface IProductService {
    Product createProduct(ProductRequest product);
    Product updateProduct(int productId, ProductRequest updatedProduct);
    void deleteProduct(int productId);
    Product getProductById(int productId);
    List<Product> getAllProducts();
}
