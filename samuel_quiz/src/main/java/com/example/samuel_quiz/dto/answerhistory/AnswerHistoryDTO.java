package com.example.samuel_quiz.dto.answerhistory;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AnswerHistoryDTO {
    Long id;
    String answerText;
    Integer isCorrect;
    Integer isChoose;
}
