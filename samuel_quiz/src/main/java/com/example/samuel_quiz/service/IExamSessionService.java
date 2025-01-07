package com.example.samuel_quiz.service;

import com.example.samuel_quiz.dto.examsession.request.ExamSessionCreateRequest;
import com.example.samuel_quiz.dto.examsession.request.ExamSessionUpdateRequest;
import com.example.samuel_quiz.dto.examsession.response.ExamSessionResponse;
import com.example.samuel_quiz.dto.examsession.response.ExamSessionStatsResponse;
import com.example.samuel_quiz.dto.result.response.ResultResponse;

import java.util.List;

public interface IExamSessionService {
    List<ExamSessionResponse> getExamSessions();
    ExamSessionResponse getExamSession(Long id);
    ExamSessionResponse createExamSession(ExamSessionCreateRequest request);
    ExamSessionResponse updateExamSession(Long id, ExamSessionUpdateRequest request);
    void deleteExamSession(Long id);
    List<ExamSessionResponse> getExamSessionsByTeacherId(String teacherId);
    List<ExamSessionResponse> getExamSessionsByStudentId(String studentId);
    ExamSessionStatsResponse getExamSessionStats(Long examSessionId);
} 