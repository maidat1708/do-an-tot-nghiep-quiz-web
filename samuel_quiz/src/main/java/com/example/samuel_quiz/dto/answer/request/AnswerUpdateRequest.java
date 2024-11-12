package com.example.samuel_quiz.dto.answer.request;

import lombok.Data;

@Data
public class AnswerUpdateRequest {
    String answerText;
    Integer isCorrect;
    Long questionId;
}
