package com.example.samuel_quiz.dto.quiz.request;

import java.util.Set;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class QuizCreateRequest {
    Long subjectId; 
    String quizName; 
    Long totalQuestion; 
    Long duration; 
    Set<Long> questionIds; 
}
