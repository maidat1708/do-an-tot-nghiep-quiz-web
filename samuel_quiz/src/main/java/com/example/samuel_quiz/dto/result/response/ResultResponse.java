package com.example.samuel_quiz.dto.result.response;

import java.time.LocalDateTime;

import com.example.samuel_quiz.dto.quiz.QuizDTO;
import com.example.samuel_quiz.dto.user.UserDTO;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ResultResponse {
    Long id;
    float score;
    Long totalQuestion;
    Long correctAnswer;
    Long examDuration;
    LocalDateTime timeStart;
    //TODO
    QuizDTO quiz;
    UserDTO user;
}
