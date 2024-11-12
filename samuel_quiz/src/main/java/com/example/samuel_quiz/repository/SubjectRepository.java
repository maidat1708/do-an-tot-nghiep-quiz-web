package com.example.samuel_quiz.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.samuel_quiz.entities.Subject;

@Repository
public interface SubjectRepository extends JpaRepository<Subject, Long> {
    // Có thể thêm các phương thức query bổ sung nếu cần

}
