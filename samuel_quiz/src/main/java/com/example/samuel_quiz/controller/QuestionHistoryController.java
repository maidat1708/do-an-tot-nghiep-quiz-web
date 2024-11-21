package com.example.samuel_quiz.controller;

import com.example.samuel_quiz.dto.auth.response.APIResponse;
import com.example.samuel_quiz.dto.questionhistory.request.QuestionHistoryUpdateRequest;
import com.example.samuel_quiz.dto.questionhistory.response.QuestionHistoryResponse;
import com.example.samuel_quiz.service.impl.QuestionHistoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/question-histories")
@RequiredArgsConstructor
public class QuestionHistoryController {
    private final QuestionHistoryService questionHistoryService;

    @PutMapping("/{id}")
    public APIResponse<QuestionHistoryResponse> updateQuestionHistory(
            @PathVariable Long id,
            @RequestBody QuestionHistoryUpdateRequest request) {
        return APIResponse.<QuestionHistoryResponse>builder()
                .result(questionHistoryService.updateQuestionHistory(id, request))
                .build();
    }
} 