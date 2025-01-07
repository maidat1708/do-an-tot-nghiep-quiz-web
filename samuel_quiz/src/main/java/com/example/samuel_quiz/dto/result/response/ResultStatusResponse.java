package com.example.samuel_quiz.dto.result.response;

import com.example.samuel_quiz.dto.user.response.UserResponse;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.List;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ResultStatusResponse {
    Long id;
    double score;
    Integer totalCorrect;
    Long totalQuestion;
    LocalDateTime timeStart;
    LocalDateTime submitTime;
    Long examDuration;
    Long quizId;
    UserResponse user;
    Long subjectId;
    String quizName;
    List<QuestionResultResponse> questionResults;
}
