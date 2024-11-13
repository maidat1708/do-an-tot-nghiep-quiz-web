package com.example.samuel_quiz.dto.quiz;

import com.example.samuel_quiz.dto.question.QuestionDTO;
import com.example.samuel_quiz.dto.result.ResultDTO;
import com.example.samuel_quiz.dto.subject.SubjectDTO;
import com.example.samuel_quiz.entities.Question;
import com.example.samuel_quiz.entities.Result;
import com.example.samuel_quiz.entities.Subject;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import java.util.Set;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class QuizDTO {
    Long id;
    String quizName;
    Long totalQuestion;
    Long duration; // thoi gian lam bai
    SubjectDTO subject;
    Set<ResultDTO> result;
    Set<QuestionDTO> questions;
}
