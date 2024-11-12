package com.example.samuel_quiz.dto.quiz.response;

import java.util.Set;

import com.example.samuel_quiz.entities.Question;
import com.example.samuel_quiz.entities.Result;
import com.example.samuel_quiz.entities.Subject;

import lombok.Data;

@Data
public class QuizResponse {
    Long id; // ID của Quiz
    String quizName; // Tên của Quiz
    Long totalQuestion; // Tổng số câu hỏi
    Long duration; // Thời gian làm bài
    Subject subject; // Trả về thông tin chi tiết của Subject
    Set<Question> questions; // Danh sách các câu hỏi liên kết với Quiz
    Set<Result> result; // Thông tin kết quả (Result) liên kết với Quiz
}
