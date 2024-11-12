package com.example.samuel_quiz.dto.result.request;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class ResultUpdateRequest {
    float score;
    Long totalQuestion;
    Long correctAnswer;
    Long examDuration;
    LocalDateTime timeStart;
}
