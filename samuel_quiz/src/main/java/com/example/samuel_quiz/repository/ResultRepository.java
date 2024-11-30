package com.example.samuel_quiz.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.samuel_quiz.entities.Result;
import com.example.samuel_quiz.entities.User;

@Repository
public interface ResultRepository extends JpaRepository<Result, Long> {
    List<Result> findByUserId(String userId);
    List<Result> findByQuizId(Long quizId);
    List<Result> findByUserOrderByTimeEndDesc(User user);
}
