package com.example.samuel_quiz.dto.answer.response;

import com.example.samuel_quiz.entities.Question;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AnswerResponse {
    Long id;
    String answerText;
    Integer isCorrect;
    Question question; // Trả về thông tin câu hỏi liên kết
}
