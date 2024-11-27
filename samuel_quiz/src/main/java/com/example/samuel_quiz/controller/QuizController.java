package com.example.samuel_quiz.controller;

import java.util.List;
import java.io.IOException;

import com.example.samuel_quiz.dto.result.response.ResultResponse;
import com.example.samuel_quiz.service.impl.WordService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.MediaType;

import com.example.samuel_quiz.dto.quiz.request.QuizCreateRequest;
import com.example.samuel_quiz.dto.quiz.request.QuizUpdateRequest;
import com.example.samuel_quiz.dto.quiz.request.QuizImportRequest;
import com.example.samuel_quiz.dto.quiz.request.QuizSubmissionRequest;
import com.example.samuel_quiz.dto.quiz.response.QuizResponse;
import com.example.samuel_quiz.dto.auth.response.APIResponse;
import com.example.samuel_quiz.service.IQuizService;
import com.example.samuel_quiz.service.impl.PDFService;

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

    @PostMapping("/import-excel")
    public APIResponse<QuizResponse> importQuiz(
            @ModelAttribute QuizImportRequest request) {
        return APIResponse.<QuizResponse>builder()
                .result(quizService.importQuiz(request))
                .build();
    }

    @PostMapping("/import-word")
    public APIResponse<QuizResponse> importQuizFromWord(
            @ModelAttribute QuizImportRequest request) {
        return APIResponse.<QuizResponse>builder()
                .result(quizService.importQuizFromWord(request))
                .build();
    }

    @PostMapping("/import-pdf")
    public APIResponse<QuizResponse> importQuizFromPDF(
            @ModelAttribute QuizImportRequest request) {
        return APIResponse.<QuizResponse>builder()
                .result(quizService.importQuizFromPDF(request))
                .build();
    }

    @PostMapping("/submit")
    @Operation(summary = "Nộp bài và chấm điểm", description = "API để nộp bài và nhận kết quả chấm điểm")
    public APIResponse<ResultResponse> submitQuiz(
            @RequestBody QuizSubmissionRequest request) {
        return APIResponse.<ResultResponse>builder()
                .result(quizService.gradeQuiz(request))
                .build();
    }

    @GetMapping("/{quizId}/export-word")
    public ResponseEntity<ByteArrayResource> exportQuizToWord(@PathVariable Long quizId, @RequestParam Long templateId) throws IOException {
        byte[] data = quizService.createWordQuiz(quizId, templateId);
        ByteArrayResource resource = new ByteArrayResource(data);
        
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.wordprocessingml.document"))
                .header("Content-Disposition", "attachment; filename=quiz_" + quizId + ".docx")
                .contentLength(data.length)
                .body(resource);
    }

    @GetMapping("/{quizId}/export-pdf")
    public ResponseEntity<ByteArrayResource> exportQuizToPDF(@PathVariable Long quizId, @RequestParam Long templateId) throws IOException {
        byte[] data = quizService.createPDFQuiz(quizId, templateId);
        ByteArrayResource resource = new ByteArrayResource(data);
        
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header("Content-Disposition", "attachment; filename=quiz_" + quizId + ".pdf")
                .contentLength(data.length)
                .body(resource);
    }

}
