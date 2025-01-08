package com.example.samuel_quiz.dto.quiz.request;

import com.example.samuel_quiz.dto.question.QuestionPreviewDTO;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class QuizImportRequest {
    Long subjectId;
    String quizName;
    Long duration;
    List<QuestionPreviewDTO> questions;
} 