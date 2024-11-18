package com.example.samuel_quiz.dto.quiz;

import com.example.samuel_quiz.dto.questionhistory.QuestionHistoryDTO;
import com.example.samuel_quiz.dto.subject.SubjectDTO;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class QuizDTO {
    Long id;
    String quizName;
    Long totalQuestion;
    Long duration; // thoi gian lam bai
    SubjectDTO subject;
    Set<QuestionHistoryDTO> questionHistories;
}
