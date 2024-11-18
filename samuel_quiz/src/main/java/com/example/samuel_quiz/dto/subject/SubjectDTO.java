package com.example.samuel_quiz.dto.subject;

import com.example.samuel_quiz.dto.question.QuestionDTO;
import com.example.samuel_quiz.dto.quiz.QuizDTO;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PACKAGE)
public class SubjectDTO {
    Long id;
    String subjectName;
    String description;
    Set<QuizDTO> quizzes;
    @JsonIgnore
    Set<QuestionDTO> questions;
}
