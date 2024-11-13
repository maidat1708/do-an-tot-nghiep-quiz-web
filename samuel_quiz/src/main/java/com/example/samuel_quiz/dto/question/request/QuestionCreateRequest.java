package com.example.samuel_quiz.dto.question.request;

import java.util.Set;

import lombok.Data;

@Data
public class QuestionCreateRequest  {
    String questionText; // Nội dung câu hỏi
    Integer level; // Mức độ câu hỏi
    Long subjectId; // ID của môn học liên kết
    Set<Long> answerIds; // Danh sách ID các đáp án
}