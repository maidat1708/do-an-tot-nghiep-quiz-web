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

import com.example.samuel_quiz.dto.response.APIResponse;
import com.example.samuel_quiz.dto.result.request.ResultCreateRequest;
import com.example.samuel_quiz.dto.result.request.ResultUpdateRequest;
import com.example.samuel_quiz.dto.result.response.ResultResponse;
import com.example.samuel_quiz.service.IResultService;

import io.swagger.v3.oas.annotations.parameters.RequestBody;
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

}
