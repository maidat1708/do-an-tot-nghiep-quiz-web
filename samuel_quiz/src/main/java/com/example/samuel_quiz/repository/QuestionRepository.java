package com.example.samuel_quiz.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.samuel_quiz.entities.Question;

import java.util.List;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {
    // Có thể thêm các phương thức query bổ sung nếu cần
    List<Question> findBySubjectId(Long subjectId);
}
