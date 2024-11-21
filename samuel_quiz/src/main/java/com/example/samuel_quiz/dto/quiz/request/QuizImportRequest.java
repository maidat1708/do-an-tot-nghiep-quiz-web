package com.example.samuel_quiz.dto.quiz.request;

import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.web.multipart.MultipartFile;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class QuizImportRequest {
    Long subjectId;
    String quizName;
    Long duration;
    MultipartFile file;
} 