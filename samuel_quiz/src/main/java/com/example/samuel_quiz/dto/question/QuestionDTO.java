package com.example.samuel_quiz.dto.question;

import com.example.samuel_quiz.dto.answer.AnswerDTO;
import com.example.samuel_quiz.dto.quiz.QuizDTO;
import com.example.samuel_quiz.dto.subject.SubjectDTO;
import com.example.samuel_quiz.entities.Answer;
import com.example.samuel_quiz.entities.Quiz;
import com.example.samuel_quiz.entities.Subject;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class QuestionDTO {
    Long id;
    String questionText;
    Integer level;
    SubjectDTO subject;
    Set<AnswerDTO> answers;
    boolean isValid;
    String errorMessage;
}
