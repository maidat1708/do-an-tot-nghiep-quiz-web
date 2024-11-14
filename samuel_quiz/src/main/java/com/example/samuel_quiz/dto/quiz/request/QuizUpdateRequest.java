package com.example.samuel_quiz.dto.quiz.request;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class QuizUpdateRequest {
    String quizName;
    Long totalQuestion;
    Long duration;
}
