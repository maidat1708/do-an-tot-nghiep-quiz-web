package com.example.samuel_quiz.dto.question.response;

import com.example.samuel_quiz.dto.answer.AnswerDTO;
import com.example.samuel_quiz.entities.Answer;
import com.example.samuel_quiz.entities.Quiz;
import com.example.samuel_quiz.entities.Subject;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import java.util.Set;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class QuestionCreationResponse {
    Long id; // ID của câu hỏi
    String questionText; // Nội dung câu hỏi
    Integer level; // Mức độ câu hỏi
    Set<AnswerDTO> answers; // Các đáp án liên kết
}
