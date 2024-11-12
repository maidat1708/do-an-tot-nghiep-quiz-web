package com.example.samuel_quiz.service;

import java.util.List;

import com.example.samuel_quiz.dto.quiz.request.QuizCreateRequest;
import com.example.samuel_quiz.dto.quiz.request.QuizUpdateRequest;
import com.example.samuel_quiz.dto.quiz.response.QuizResponse;

public interface IQuizService {
    List<QuizResponse> getQuizzes();

    QuizResponse getQuiz(Long quizId);

    QuizResponse createQuiz(QuizCreateRequest request);

    QuizResponse updateQuiz(Long quizId, QuizUpdateRequest request);

    void deleteQuiz(Long quizId);

}
