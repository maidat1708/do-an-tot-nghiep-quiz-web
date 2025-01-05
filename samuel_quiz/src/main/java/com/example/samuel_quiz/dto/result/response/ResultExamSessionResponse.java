package com.example.samuel_quiz.dto.result.response;

import com.example.samuel_quiz.dto.user.UserDTO;
import com.example.samuel_quiz.dto.user.response.UserResponse;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.List;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonInclude(JsonInclude.Include.NON_NULL) // chỉ hiện những trường ko null
public class ResultExamSessionResponse {
    Long id;
    Float score;
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
