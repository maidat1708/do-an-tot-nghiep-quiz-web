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

import com.example.samuel_quiz.dto.quiz.request.QuizCreateRequest;
import com.example.samuel_quiz.dto.quiz.request.QuizUpdateRequest;
import com.example.samuel_quiz.dto.quiz.response.QuizResponse;
import com.example.samuel_quiz.dto.response.APIResponse;
import com.example.samuel_quiz.service.IQuizService;

import io.swagger.v3.oas.annotations.parameters.RequestBody;
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
