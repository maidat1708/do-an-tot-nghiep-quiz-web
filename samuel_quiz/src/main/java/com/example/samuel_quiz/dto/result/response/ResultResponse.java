package com.example.samuel_quiz.dto.result.response;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class ResultResponse {
    Long id;
    float score;
    Long totalQuestion;
    Long correctAnswer;
    Long examDuration;
    LocalDateTime timeStart;
    //TODO
    Long userId;  // Thêm userId và quizId để trả về thông tin liên kết
    Long quizId;
}
