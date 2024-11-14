package com.example.samuel_quiz.dto.question.request;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class QuestionUpdateRequest {
    String questionText; // Nội dung câu hỏi
    Integer level; // Mức độ câu hỏi
}
