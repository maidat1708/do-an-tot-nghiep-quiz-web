package com.example.samuel_quiz.dto.result;

import com.example.samuel_quiz.dto.quiz.QuizDTO;
import com.example.samuel_quiz.dto.user.UserDTO;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ResultDTO {
    Long id;
    double score;
    Long totalQuestion;
    Long correctAnswer;
    Long examDuration;
    LocalDateTime timeStart;
    LocalDateTime timeEnd;
    Set<ResultDetailDTO> resultDetails;
    QuizDTO quiz;
    UserDTO user;
}
