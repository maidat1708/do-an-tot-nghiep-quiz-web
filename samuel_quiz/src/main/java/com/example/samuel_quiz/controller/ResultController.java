package com.example.samuel_quiz.controller;

import java.util.List;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.samuel_quiz.dto.auth.response.APIResponse;
import com.example.samuel_quiz.dto.result.request.ResultCreateRequest;
import com.example.samuel_quiz.dto.result.request.ResultUpdateRequest;
import com.example.samuel_quiz.dto.result.response.ResultResponse;
import com.example.samuel_quiz.service.IResultService;

import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;

@RestController
@RequestMapping("results")
@FieldDefaults(level = AccessLevel.PRIVATE)
@Tag(name = "RESULT", description = "Kết quả thi")
public class ResultController {

    @Autowired
    IResultService resultService;

    @GetMapping
    public APIResponse<List<ResultResponse>> getResults() {
        return APIResponse.<List<ResultResponse>>builder()
                .result(resultService.getResults())
                .build();
    }

    @GetMapping("/{id}")
    public APIResponse<ResultResponse> getResult(@PathVariable Long id) {
        return APIResponse.<ResultResponse>builder()
                .result(resultService.getResult(id))
                .build();
    }

    @PostMapping
    public APIResponse<ResultResponse> createResult(@RequestBody ResultCreateRequest request) {
        return APIResponse.<ResultResponse>builder()
                .result(resultService.createResult(request))
                .build();
    }

    @PutMapping("/{id}")
    public APIResponse<ResultResponse> updateResult(@PathVariable Long id, @RequestBody ResultUpdateRequest request) {
        return APIResponse.<ResultResponse>builder()
                .result(resultService.updateResult(id, request))
                .build();
    }

    @DeleteMapping("/{id}")
    public APIResponse<Void> deleteResult(@PathVariable Long id) {
        resultService.deleteResult(id);
        return APIResponse.<Void>builder().build();
    }

    @GetMapping("/user/{userId}")
    @Operation(summary = "Lấy kết quả thi theo userId")
    public APIResponse<List<ResultResponse>> getResultsByUserId(@PathVariable String userId) {
        return APIResponse.<List<ResultResponse>>builder()
                .result(resultService.getResultsByUserId(userId))
                .build();
    }

}
