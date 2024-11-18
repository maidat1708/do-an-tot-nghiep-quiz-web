package com.example.samuel_quiz.controller;

import java.util.List;

import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.samuel_quiz.dto.auth.response.APIResponse;
import com.example.samuel_quiz.dto.subject.request.SubjectCreateRequest;
import com.example.samuel_quiz.dto.subject.request.SubjectUpdateRequest;
import com.example.samuel_quiz.dto.subject.response.SubjectResponse;
import com.example.samuel_quiz.service.ISubjectService;

import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;

@RestController
@RequestMapping("subjects")
@FieldDefaults(level = AccessLevel.PRIVATE)
@Tag(name = "SUBJECT", description = "Môn thi")
public class SubjectController {

    @Autowired
    ISubjectService subjectService;

    @GetMapping
    public APIResponse<List<SubjectResponse>> getSubjects() {
        return APIResponse.<List<SubjectResponse>>builder()
                .result(subjectService.getSubjects())
                .build();
    }

    @GetMapping("/{id}")
    public APIResponse<SubjectResponse> getSubject(@PathVariable Long id) {
        return APIResponse.<SubjectResponse>builder()
                .result(subjectService.getSubject(id))
                .build();
    }

    @PostMapping
    APIResponse<SubjectResponse> createSubject(@RequestBody SubjectCreateRequest request) {
        return APIResponse.<SubjectResponse>builder()
                .result(subjectService.createSubject(request))
                .build();
    }

    @PutMapping("/{id}")
    public APIResponse<SubjectResponse> updateSubject(@PathVariable Long id,
            @RequestBody SubjectUpdateRequest request) {
        return APIResponse.<SubjectResponse>builder()
                .result(subjectService.updateSubject(id, request))
                .build();
    }

    @DeleteMapping("/{id}")
    public APIResponse<Void> deleteSubject(@PathVariable Long id) {
        subjectService.deleteSubject(id);
        return APIResponse.<Void>builder().build();
    }
}
