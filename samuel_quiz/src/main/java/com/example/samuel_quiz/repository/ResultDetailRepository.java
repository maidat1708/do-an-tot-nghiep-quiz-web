package com.example.samuel_quiz.repository;

import com.example.samuel_quiz.entities.ResultDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ResultDetailRepository extends JpaRepository<ResultDetail, Long> {
} 