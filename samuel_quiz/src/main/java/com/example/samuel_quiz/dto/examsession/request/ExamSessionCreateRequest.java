package com.example.samuel_quiz.dto.examsession.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.Set;

@Data
@Builder
public class ExamSessionCreateRequest {
    @NotBlank
    private String name;
    
    @NotNull
    private LocalDateTime startTime;
    
    @NotNull
    private LocalDateTime endTime;
    
    @NotNull
    private Long quizId;
    
    @NotEmpty
    private Set<String> teacherIds;
    
    @NotEmpty  
    private Set<String> studentIds;
}