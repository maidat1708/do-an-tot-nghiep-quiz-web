package com.example.samuel_quiz.dto.question.request;

import java.util.Set;

import com.example.samuel_quiz.dto.answer.AnswerDTO;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class QuestionCreateRequest  {
    String questionText; // Nội dung câu hỏi
    Integer level; // Mức độ câu hỏi
    Long subjectId; // ID của môn học liên kết
    Set<AnswerDTO> answers; // Danh sách ID các đáp án
}
