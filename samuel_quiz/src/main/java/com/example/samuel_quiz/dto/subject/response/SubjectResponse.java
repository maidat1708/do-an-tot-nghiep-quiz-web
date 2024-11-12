package com.example.samuel_quiz.dto.subject.response;

import java.util.Set;

import com.example.samuel_quiz.entities.Question;
import com.example.samuel_quiz.entities.Quiz;

import lombok.Data;

@Data
public class SubjectResponse {
    Long id; // ID của Subject
    String subjectName; // Tên Subject
    String description; // Mô tả
    Set<Quiz> quizzes; // Danh sách các Quiz liên kết
    Set<Question> questions; // Danh sách các câu hỏi liên kết
}