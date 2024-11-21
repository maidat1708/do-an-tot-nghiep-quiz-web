package com.example.samuel_quiz.repository;

import com.example.samuel_quiz.entities.Question;
import com.example.samuel_quiz.entities.QuestionHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface QuestionHistoryRepository extends JpaRepository<QuestionHistory, Long> {
    Optional<QuestionHistory> findByQuestionText(String questionText);
    
    List<QuestionHistory> findByQuizzesId(Long quizId);
    
    @Modifying
    @Query("DELETE FROM QuestionHistory qh WHERE qh.id IN " +
           "(SELECT qh2.id FROM QuestionHistory qh2 JOIN qh2.quizzes q WHERE q.id = :quizId)")
    void deleteByQuizId(@Param("quizId") Long quizId);
}
