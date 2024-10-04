package com.example.samuel_quiz.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.samuel_quiz.entities.User;

@Repository
public interface UserRepository extends JpaRepository<User,String>{
    boolean existsByUsername(String username);
    Optional<User> findByUsername(String username);
}
