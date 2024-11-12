package com.example.samuel_quiz.dto.quiz.request;

import lombok.Data;

@Data
public class QuizUpdateRequest {
    String quizName;
    Long totalQuestion;
    Long duration;
}
