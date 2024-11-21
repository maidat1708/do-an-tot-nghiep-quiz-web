package com.example.samuel_quiz.dto.answer.response;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AnswerTextResponse {
    Long id;
    String answerText;
}
