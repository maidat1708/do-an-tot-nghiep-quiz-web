package com.example.samuel_quiz.dto.subject;

import com.example.samuel_quiz.dto.question.QuestionDTO;
import com.example.samuel_quiz.dto.quiz.QuizDTO;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import java.util.Set;

@Data
@FieldDefaults(level = AccessLevel.PACKAGE)
public class SubjectDTO {
    Long id;
    String subjectName;
    String description;
    Set<QuizDTO> quizzes;
    Set<QuestionDTO> questions;
}
