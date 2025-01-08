package com.example.samuel_quiz.dto.examsession.request;

import com.example.samuel_quiz.enums.ExamSessionStatus;
import lombok.Data;
import lombok.Builder;

import java.time.LocalDateTime;
import java.util.Set;

@Data
@Builder
public class ExamSessionUpdateRequest {
    private String name;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private Long quizId;
    private Set<String> teacherIds;
    private Set<String> studentIds;
    private Boolean allowReview;
}