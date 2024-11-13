package com.example.samuel_quiz.dto.answer;

import com.example.samuel_quiz.dto.question.QuestionDTO;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AnswerDTO {
    Long id;
    String answerText;
    Integer isCorrect;
    QuestionDTO question;
}

