package com.example.samuel_quiz.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.samuel_quiz.entities.InvalidToken;

public interface InvalidTokenRepository extends JpaRepository<InvalidToken,String>{
    
}
