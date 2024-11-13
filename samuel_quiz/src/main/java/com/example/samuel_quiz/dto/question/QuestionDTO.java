package com.example.samuel_quiz.dto.question;

import com.example.samuel_quiz.entities.Answer;
import com.example.samuel_quiz.entities.Quiz;
import com.example.samuel_quiz.entities.Subject;
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
    Set<Answer> answers;
    Subject subject;
}
