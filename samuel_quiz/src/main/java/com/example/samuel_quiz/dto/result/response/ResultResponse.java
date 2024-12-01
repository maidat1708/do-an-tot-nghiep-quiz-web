package com.example.samuel_quiz.dto.result.response;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

import com.example.samuel_quiz.dto.quiz.QuizDTO;
import com.example.samuel_quiz.dto.user.UserDTO;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ResultResponse {
    Long id;
    Float score;
    Integer totalCorrect;
    Long totalQuestion;
    LocalDateTime timeStart;
    LocalDateTime submitTime;
    Long examDuration;
    Long quizId;
    String userId;
    Long subjectId;
    String quizName;
    List<QuestionResultResponse> questionResults;
}
