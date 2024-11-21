package com.example.samuel_quiz.dto.questionhistory.request;

import com.example.samuel_quiz.dto.answerhistory.AnswerHistoryDTO;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import java.util.Set;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class QuestionHistoryUpdateRequest {
    String questionText;
    Integer level;
    Long subjectId;
    Set<AnswerHistoryDTO> answers;
} 