package com.example.samuel_quiz.repository;

import com.example.samuel_quiz.entities.Answer;
import com.example.samuel_quiz.entities.AnswerHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AnswerHistoryRepository extends JpaRepository<AnswerHistory, Long> {
    // Có thể thêm các phương thức query bổ sung nếu cần
}
