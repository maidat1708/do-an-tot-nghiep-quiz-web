package com.example.samuel_quiz.dto.examsession.response;

import com.example.samuel_quiz.dto.quiz.response.QuizResponse;
import com.example.samuel_quiz.dto.user.response.UserResponse;
import com.example.samuel_quiz.enums.ExamSessionStatus;
import lombok.Data;
import lombok.Builder;

import java.time.LocalDateTime;
import java.util.Set;

@Data
@Builder
public class ExamSessionResponse {
    private Long id;
    private String name;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private QuizResponse quiz;
    private Set<UserResponse> teachers;
    private Set<UserResponse> students;
    private String status;
    private Boolean allowReview;
} 