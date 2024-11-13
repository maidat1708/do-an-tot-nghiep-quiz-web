package com.example.samuel_quiz.controller;

import java.util.List;

import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.samuel_quiz.dto.answer.request.AnswerCreateRequest;
import com.example.samuel_quiz.dto.answer.request.AnswerUpdateRequest;
import com.example.samuel_quiz.dto.answer.response.AnswerResponse;
import com.example.samuel_quiz.dto.response.APIResponse;
import com.example.samuel_quiz.service.IAnswerService;

import io.swagger.v3.oas.annotations.parameters.RequestBody;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;

@RestController
@RequestMapping("answers")
@FieldDefaults(level = AccessLevel.PRIVATE)
@Tag(name = "ANSWER", description = "Đáp án")
public class AnswerController {

    @Autowired
    IAnswerService answerService;

    @GetMapping
    public APIResponse<List<AnswerResponse>> getAnswers() {
        return APIResponse.<List<AnswerResponse>>builder()
                .result(answerService.getAnswers())
                .build();
    }

    @GetMapping("/{id}")
    public APIResponse<AnswerResponse> getAnswer(@PathVariable Long id) {
        return APIResponse.<AnswerResponse>builder()
                .result(answerService.getAnswer(id))
                .build();
    }

    @PostMapping
    public APIResponse<AnswerResponse> createAnswer(@RequestBody AnswerCreateRequest request) {
        return APIResponse.<AnswerResponse>builder()
                .result(answerService.createAnswer(request))
                .build();
    }

    @PutMapping("/{id}")
    public APIResponse<AnswerResponse> updateAnswer(@PathVariable Long id, @RequestBody AnswerUpdateRequest request) {
        return APIResponse.<AnswerResponse>builder()
                .result(answerService.updateAnswer(id, request))
                .build();
    }

    @DeleteMapping("/{id}")
    public APIResponse<Void> deleteAnswer(@PathVariable Long id) {
        answerService.deleteAnswer(id);
        return APIResponse.<Void>builder().build();
    }
}