package com.example.samuel_quiz.dto.questionhistory;

import com.example.samuel_quiz.dto.answerhistory.AnswerHistoryDTO;
import com.example.samuel_quiz.entities.AnswerHistory;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class QuestionHistoryDTO {
    Long id;
    String questionText;
    Integer level;
    Set<AnswerHistoryDTO> answerHistories;
}
