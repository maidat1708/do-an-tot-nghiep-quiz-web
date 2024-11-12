package com.example.samuel_quiz.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.samuel_quiz.dto.question.request.QuestionCreateRequest;
import com.example.samuel_quiz.dto.question.request.QuestionUpdateRequest;
import com.example.samuel_quiz.dto.question.response.QuestionResponse;
import com.example.samuel_quiz.dto.response.APIResponse;
import com.example.samuel_quiz.service.IQuestionService;

import io.swagger.v3.oas.annotations.parameters.RequestBody;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;

@RestController
@RequestMapping("questions")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class QuestionController {

    @Autowired
    IQuestionService questionService;

    @GetMapping
    public APIResponse<List<QuestionResponse>> getQuestions() {
        return APIResponse.<List<QuestionResponse>>builder()
                .result(questionService.getQuestions())
                .build();
    }

    @GetMapping("/{id}")
    public APIResponse<QuestionResponse> getQuestion(@PathVariable Long id) {
        return APIResponse.<QuestionResponse>builder()
                .result(questionService.getQuestion(id))
                .build();
    }

    @PostMapping
    public APIResponse<QuestionResponse> createQuestion(@RequestBody QuestionCreateRequest request) {
        return APIResponse.<QuestionResponse>builder()
                .result(questionService.createQuestion(request))
                .build();
    }

    @PutMapping("/{id}")
    public APIResponse<QuestionResponse> updateQuestion(@PathVariable Long id,
            @RequestBody QuestionUpdateRequest request) {
        return APIResponse.<QuestionResponse>builder()
                .result(questionService.updateQuestion(id, request))
                .build();
    }

    @DeleteMapping("/{id}")
    public APIResponse<Void> deleteQuestion(@PathVariable Long id) {
        questionService.deleteQuestion(id);
        return APIResponse.<Void>builder().build();
    }
}
