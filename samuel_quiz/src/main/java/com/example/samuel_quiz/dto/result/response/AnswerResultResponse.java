package com.example.samuel_quiz.dto.result.response;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AnswerResultResponse {
    Long id;
    String answerText;
    Integer isCorrect;
}