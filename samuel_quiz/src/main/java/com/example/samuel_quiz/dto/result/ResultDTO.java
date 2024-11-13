package com.example.samuel_quiz.dto.result;

import com.example.samuel_quiz.dto.quiz.QuizDTO;
import com.example.samuel_quiz.dto.user.UserDTO;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ResultDTO {
    Long id;
    float score;
    Long totalQuestion;
    Long correctAnswer;
    Long examDuration;
    LocalDateTime timeStart;
    QuizDTO quiz;
    UserDTO user;
}
