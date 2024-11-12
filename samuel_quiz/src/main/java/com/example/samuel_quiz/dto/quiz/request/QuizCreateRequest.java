package com.example.samuel_quiz.dto.quiz.request;

import java.util.Set;

import lombok.Data;

@Data
public class QuizCreateRequest {
    Long subjectId; 
    String quizName; 
    Long totalQuestion; 
    Long duration; 
    Set<Long> questionIds; 
}
