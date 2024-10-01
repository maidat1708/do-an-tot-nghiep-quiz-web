package com.example.samuel_shop.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.samuel_shop.Entities.Product;

@Repository
public interface ProductRepository extends JpaRepository<Product,Integer>{
    
}
