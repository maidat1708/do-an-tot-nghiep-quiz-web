package com.example.samuel_quiz.dto.subject.response;

import java.util.Set;

import com.example.samuel_quiz.dto.question.QuestionDTO;
import com.example.samuel_quiz.dto.quiz.QuizDTO;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SubjectResponse {
    Long id; // ID của Subject
    String subjectName; // Tên Subject
    String description; // Mô tả
    Set<QuizDTO> quizzes; // Danh sách các Quiz liên kết
    Set<QuestionDTO> questions; // Danh sách các câu hỏi liên kết
}