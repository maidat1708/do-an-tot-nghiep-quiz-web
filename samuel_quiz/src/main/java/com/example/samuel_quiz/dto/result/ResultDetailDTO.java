package com.example.samuel_quiz.dto.result;

import com.example.samuel_quiz.dto.questionhistory.QuestionHistoryDTO;
import com.example.samuel_quiz.dto.answerhistory.AnswerHistoryDTO;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ResultDetailDTO {
    Long id;
    QuestionHistoryDTO questionHistory;
    Set<AnswerHistoryDTO> selectedAnswers;
    Integer isCorrect;
} 