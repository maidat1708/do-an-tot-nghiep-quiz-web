package com.example.samuel_quiz.dto.question.response;

import java.util.Set;

import com.example.samuel_quiz.dto.answer.AnswerDTO;
import com.example.samuel_quiz.dto.subject.SubjectDTO;
import com.example.samuel_quiz.entities.Answer;
import com.example.samuel_quiz.entities.Quiz;
import com.example.samuel_quiz.entities.Subject;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class QuestionResponse {
    Long id; // ID của câu hỏi
    String questionText; // Nội dung câu hỏi
    Integer level; // Mức độ câu hỏi
    SubjectDTO subject;
    Set<AnswerDTO> answers; // Các đáp án liên kết
}
