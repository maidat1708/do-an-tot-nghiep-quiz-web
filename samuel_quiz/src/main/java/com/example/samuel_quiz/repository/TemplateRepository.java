package com.example.samuel_quiz.repository;

import com.example.samuel_quiz.entities.Template;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TemplateRepository extends JpaRepository<Template, Long> {
    
    // Tìm tất cả template theo subject ID
    List<Template> findBySubjectId(Long subjectId);
    
    // Tìm template theo tên và subject ID
    Template findByNameAndSubjectId(String name, Long subjectId);
    
    // Đếm số lượng template theo subject ID
    long countBySubjectId(Long subjectId);
    
    // Xóa tất cả template theo subject ID
    void deleteBySubjectId(Long subjectId);
    
    // Tìm template theo loại file và subject ID
    List<Template> findByFileTypeAndSubjectId(String fileType, Long subjectId);
} 