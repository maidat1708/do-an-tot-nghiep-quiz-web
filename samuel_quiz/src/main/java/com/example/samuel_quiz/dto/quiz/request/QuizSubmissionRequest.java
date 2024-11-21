package com.example.samuel_quiz.dto.quiz.request;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.List;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class QuizSubmissionRequest {
    Long quizId;
    LocalDateTime timeStart;
    List<QuestionSubmission> submissions;
    
    @Data
    @FieldDefaults(level = AccessLevel.PRIVATE)
    public static class QuestionSubmission {
        Long questionId;
        List<Long> selectedAnswerIds;
    }
} 