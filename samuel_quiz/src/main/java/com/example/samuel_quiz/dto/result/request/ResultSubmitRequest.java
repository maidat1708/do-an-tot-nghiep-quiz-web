package com.example.samuel_quiz.dto.result.request;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ResultSubmitRequest {
    Long quizId;
    Long userId;
    List<AnswerSubmitRequest> answers;
}

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
class AnswerSubmitRequest {
    Long questionId;
    Long answerId;
} 