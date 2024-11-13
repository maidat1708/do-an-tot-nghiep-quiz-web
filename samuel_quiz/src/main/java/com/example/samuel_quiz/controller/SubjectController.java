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
import com.example.samuel_quiz.dto.subject.request.SubjectCreateRequest;
import com.example.samuel_quiz.dto.subject.request.SubjectUpdateRequest;
import com.example.samuel_quiz.dto.subject.response.SubjectResponse;
import com.example.samuel_quiz.service.ISubjectService;

import io.swagger.v3.oas.annotations.parameters.RequestBody;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;

@RestController
@RequestMapping("subjects")
@FieldDefaults(level = AccessLevel.PRIVATE)
@Tag(name = "SUBJECT", description = "")
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
    public APIResponse<SubjectResponse> createSubject(@RequestBody SubjectCreateRequest request) {
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
