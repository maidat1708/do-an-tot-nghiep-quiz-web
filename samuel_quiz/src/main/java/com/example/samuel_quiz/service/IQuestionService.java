package com.example.samuel_quiz.service;

import java.util.List;

import com.example.samuel_quiz.dto.question.request.QuestionCreateRequest;
import com.example.samuel_quiz.dto.question.request.QuestionUpdateRequest;
import com.example.samuel_quiz.dto.question.response.QuestionResponse;

public interface IQuestionService {
    // Lấy danh sách tất cả câu hỏi
    List<QuestionResponse> getQuestions();

    // Lấy chi tiết một câu hỏi theo ID
    QuestionResponse getQuestion(Long questionId);

    // Tạo một câu hỏi mới
    QuestionResponse createQuestion(QuestionCreateRequest request);

    // Cập nhật thông tin một câu hỏi theo ID
    QuestionResponse updateQuestion(Long questionId, QuestionUpdateRequest request);

    // Xóa một câu hỏi theo ID
    void deleteQuestion(Long questionId);
}
