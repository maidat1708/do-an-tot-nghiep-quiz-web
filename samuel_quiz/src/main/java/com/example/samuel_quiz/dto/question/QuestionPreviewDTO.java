package com.example.samuel_quiz.dto.question;

import com.example.samuel_quiz.dto.answer.AnswerDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QuestionPreviewDTO {
    private String questionText;
    private Integer level;
    private Set<AnswerDTO> answers;
    private boolean isValid;
    private String errorMessage;
} 