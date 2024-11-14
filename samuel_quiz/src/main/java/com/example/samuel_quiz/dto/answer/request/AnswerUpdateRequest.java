package com.example.samuel_quiz.dto.answer.request;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AnswerUpdateRequest {
    String answerText;
    Integer isCorrect;
    Long questionId;
}
