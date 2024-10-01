package com.example.samuel_shop.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.samuel_shop.Entities.InvalidToken;

public interface InvalidTokenRepository extends JpaRepository<InvalidToken,String>{
    
}
