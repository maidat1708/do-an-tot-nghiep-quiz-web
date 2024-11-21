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
    Double score;
    Integer totalCorrect;
    Integer totalQuestion;
    LocalDateTime submitTime;
    Long quizId;
    String userId;
    Set<QuestionResultResponse> questionResults;
}
