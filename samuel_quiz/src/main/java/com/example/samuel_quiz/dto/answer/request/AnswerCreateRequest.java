package com.example.samuel_quiz.dto.answer.request;

import lombok.Data;

@Data
public class AnswerCreateRequest {
    String answerText;
    Integer isCorrect;
    Long questionId; // ID của câu hỏi liên kết
}
