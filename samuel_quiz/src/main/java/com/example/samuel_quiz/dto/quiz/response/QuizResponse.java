package com.example.samuel_quiz.dto.quiz.response;

import java.util.Set;

import com.example.samuel_quiz.dto.questionhistory.QuestionHistoryDTO;
import com.example.samuel_quiz.dto.subject.SubjectDTO;
import com.example.samuel_quiz.entities.Question;
import com.example.samuel_quiz.entities.Result;
import com.example.samuel_quiz.entities.Subject;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class QuizResponse {
    Long id; // ID của Quiz
    String quizName; // Tên của Quiz
    Long totalQuestion; // Tổng số câu hỏi
    Long duration; // Thời gian làm bài
    SubjectDTO subject;
    Set<QuestionHistoryDTO> questionHistories;
}
