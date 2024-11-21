package com.example.samuel_quiz.dto.result.response;

import java.util.List;

import com.example.samuel_quiz.dto.answer.response.AnswerTextResponse;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class QuestionResultResponse {
    String questionText;
    List<AnswerResultResponse> selectedAnswers;
    List<AnswerTextResponse> answers;
    Integer isCorrect;
}