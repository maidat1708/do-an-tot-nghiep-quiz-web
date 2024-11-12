package com.example.samuel_quiz.dto.question.request;

import lombok.Data;

@Data
public class QuestionUpdateRequest {
    String questionText; // Nội dung câu hỏi
    Integer level; // Mức độ câu hỏi
}
