package com.example.samuel_quiz.dto.result.request;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class ResultCreateRequest {
    String userId;   // Thêm userId vào request để tạo liên kết
    Long quizId;   // Thêm quizId vào request để tạo liên kết
    float score;
    Long totalQuestion;
    Long correctAnswer;
    Long examDuration;
    LocalDateTime timeStart;
}