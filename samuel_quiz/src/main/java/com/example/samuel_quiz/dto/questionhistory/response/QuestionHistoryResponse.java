package com.example.samuel_quiz.dto.questionhistory.response;

import com.example.samuel_quiz.dto.answerhistory.AnswerHistoryDTO;
import com.example.samuel_quiz.dto.subject.SubjectDTO;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class QuestionHistoryResponse {
    Long id;
    String questionText;
    Integer level;
    SubjectDTO subject;
    Set<AnswerHistoryDTO> answerHistories;
} 