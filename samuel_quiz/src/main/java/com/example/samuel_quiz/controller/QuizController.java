package com.example.samuel_quiz.controller;

import java.util.List;

import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.samuel_quiz.dto.quiz.request.QuizCreateRequest;
import com.example.samuel_quiz.dto.quiz.request.QuizUpdateRequest;
import com.example.samuel_quiz.dto.quiz.response.QuizResponse;
import com.example.samuel_quiz.dto.auth.response.APIResponse;
import com.example.samuel_quiz.service.IQuizService;

import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;

@RestController
@RequestMapping("quizzes")
@FieldDefaults(level = AccessLevel.PRIVATE)
@Tag(name = "QUIZ", description = "Đề thi")
public class QuizController {

    @Autowired
    IQuizService quizService;

    @GetMapping
    public APIResponse<List<QuizResponse>> getQuizzes() {
        return APIResponse.<List<QuizResponse>>builder()
                .result(quizService.getQuizzes())
                .build();
    }

    @GetMapping("/{id}")
    public APIResponse<QuizResponse> getQuiz(@PathVariable Long id) {
        return APIResponse.<QuizResponse>builder()
                .result(quizService.getQuiz(id))
                .build();
    }

    @PostMapping
    public APIResponse<QuizResponse> createQuiz(@RequestBody QuizCreateRequest request) {
        return APIResponse.<QuizResponse>builder()
                .result(quizService.createQuiz(request))
                .build();
    }

    @PutMapping("/{id}")
    public APIResponse<QuizResponse> updateQuiz(@PathVariable Long id, @RequestBody QuizUpdateRequest request) {
        return APIResponse.<QuizResponse>builder()
                .result(quizService.updateQuiz(id, request))
                .build();
    }

    @DeleteMapping("/{id}")
    public APIResponse<Void> deleteQuiz(@PathVariable Long id) {
        quizService.deleteQuiz(id);
        return APIResponse.<Void>builder().build();
    }
}
