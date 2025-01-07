package com.example.samuel_quiz.controller;

import com.example.samuel_quiz.dto.auth.response.APIResponse;
import com.example.samuel_quiz.dto.examsession.request.ExamSessionCreateRequest;
import com.example.samuel_quiz.dto.examsession.request.ExamSessionUpdateRequest;
import com.example.samuel_quiz.dto.examsession.response.ExamSessionResponse;
import com.example.samuel_quiz.dto.examsession.response.ExamSessionStatsResponse;
import com.example.samuel_quiz.service.IExamSessionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("exam-sessions")
@Tag(name = "EXAM SESSION", description = "Quản lý ca thi")
@RequiredArgsConstructor
public class ExamSessionController {
    
    private final IExamSessionService examSessionService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    @Operation(summary = "Lấy danh sách tất cả ca thi")
    public APIResponse<List<ExamSessionResponse>> getExamSessions() {
        return APIResponse.<List<ExamSessionResponse>>builder()
                .result(examSessionService.getExamSessions())
                .build();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    @Operation(summary = "Lấy thông tin chi tiết một ca thi")
    public APIResponse<ExamSessionResponse> getExamSession(@PathVariable Long id) {
        return APIResponse.<ExamSessionResponse>builder()
                .result(examSessionService.getExamSession(id))
                .build();
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    @Operation(summary = "Tạo ca thi mới")
    public APIResponse<ExamSessionResponse> createExamSession(
            @Valid @RequestBody ExamSessionCreateRequest request) {
        return APIResponse.<ExamSessionResponse>builder()
                .result(examSessionService.createExamSession(request))
                .build();
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    @Operation(summary = "Cập nhật thông tin ca thi")
    public APIResponse<ExamSessionResponse> updateExamSession(
            @PathVariable Long id,
            @Valid @RequestBody ExamSessionUpdateRequest request) {
        return APIResponse.<ExamSessionResponse>builder()
                .result(examSessionService.updateExamSession(id, request))
                .build();
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    @Operation(summary = "Xóa ca thi")
    public APIResponse<Void> deleteExamSession(@PathVariable Long id) {
        examSessionService.deleteExamSession(id);
        return APIResponse.<Void>builder().build();
    }

    @GetMapping("/teacher/{teacherId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    @Operation(summary = "Lấy danh sách ca thi theo giáo viên")
    public APIResponse<List<ExamSessionResponse>> getExamSessionsByTeacher(
            @PathVariable String teacherId) {
        return APIResponse.<List<ExamSessionResponse>>builder()
                .result(examSessionService.getExamSessionsByTeacherId(teacherId))
                .build();
    }

    @GetMapping("/student/{studentId}")
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Lấy danh sách ca thi theo học sinh")
    public APIResponse<List<ExamSessionResponse>> getExamSessionsByStudent(
            @PathVariable String studentId) {
        return APIResponse.<List<ExamSessionResponse>>builder()
                .result(examSessionService.getExamSessionsByStudentId(studentId))
                .build();
    }

    @GetMapping("/{id}/stats")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    @Operation(summary = "Lấy thống kê điểm của ca thi")
    public APIResponse<ExamSessionStatsResponse> getExamSessionStats(@PathVariable Long id) {
        return APIResponse.<ExamSessionStatsResponse>builder()
                .result(examSessionService.getExamSessionStats(id))
                .build();
    }
} 