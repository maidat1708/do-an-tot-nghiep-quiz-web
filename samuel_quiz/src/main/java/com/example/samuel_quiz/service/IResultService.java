package com.example.samuel_quiz.service;

import java.util.List;

import com.example.samuel_quiz.dto.result.request.ResultCreateRequest;
import com.example.samuel_quiz.dto.result.request.ResultUpdateRequest;
import com.example.samuel_quiz.dto.result.response.ResultResponse;

public interface IResultService {
    List<ResultResponse> getResults();
    ResultResponse getResult(Long resultId);
    ResultResponse createResult(ResultCreateRequest request);
    ResultResponse updateResult(Long resultId, ResultUpdateRequest request);
    void deleteResult(Long resultId);
    List<ResultResponse> getResultsByUserId(String userId);
}

