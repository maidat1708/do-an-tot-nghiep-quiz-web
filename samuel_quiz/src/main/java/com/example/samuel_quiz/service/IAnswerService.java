package com.example.samuel_quiz.service;

import java.util.List;

import com.example.samuel_quiz.dto.answer.request.AnswerCreateRequest;
import com.example.samuel_quiz.dto.answer.request.AnswerUpdateRequest;
import com.example.samuel_quiz.dto.answer.response.AnswerResponse;

public interface IAnswerService {
    List<AnswerResponse> getAnswers();

    AnswerResponse getAnswer(Long answerId);

    AnswerResponse createAnswer(AnswerCreateRequest request);

    AnswerResponse updateAnswer(Long answerId, AnswerUpdateRequest request);

    void deleteAnswer(Long answerId);
}
