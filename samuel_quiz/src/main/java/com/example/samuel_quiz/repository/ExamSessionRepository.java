package com.example.samuel_quiz.repository;

import com.example.samuel_quiz.entities.ExamSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExamSessionRepository extends JpaRepository<ExamSession, Long> {
    
    @Query("SELECT es FROM ExamSession es JOIN es.teachers t WHERE t.id = :teacherId")
    List<ExamSession> findByTeacherId(String teacherId);
    
    @Query("SELECT es FROM ExamSession es JOIN es.students s WHERE s.id = :studentId")
    List<ExamSession> findByStudentId(String studentId);
}