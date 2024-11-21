package com.example.samuel_quiz.repository;

import com.example.samuel_quiz.entities.Answer;
import com.example.samuel_quiz.entities.AnswerHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AnswerHistoryRepository extends JpaRepository<AnswerHistory, Long> {
    // Xóa theo questionHistory khi xóa câu hỏi
    @Modifying
    @Query("DELETE FROM AnswerHistory ah WHERE ah.questionHistory.id = :questionHistoryId")
    void deleteByQuestionHistoryId(@Param("questionHistoryId") Long questionHistoryId);
    
    // Tìm đáp án theo questionHistory
    List<AnswerHistory> findByQuestionHistoryId(Long questionHistoryId);
}
