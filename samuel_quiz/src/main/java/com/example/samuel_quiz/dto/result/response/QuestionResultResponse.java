package com.example.samuel_quiz.dto.result.response;

import java.util.List;

import com.example.samuel_quiz.dto.answer.response.AnswerTextResponse;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class QuestionResultResponse {
    String questionText;
    List<AnswerResultResponse> selectedAnswers;
    List<AnswerTextResponse> answers;
    Integer isCorrect;
}