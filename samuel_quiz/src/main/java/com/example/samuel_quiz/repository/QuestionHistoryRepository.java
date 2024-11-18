package com.example.samuel_quiz.repository;

import com.example.samuel_quiz.entities.Question;
import com.example.samuel_quiz.entities.QuestionHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface QuestionHistoryRepository extends JpaRepository<QuestionHistory, Long> {
    // Có thể thêm các phương thức query bổ sung nếu cần
}
