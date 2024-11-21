package com.example.samuel_quiz.dto.quiz.request;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;
import java.util.Set;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class QuizUpdateRequest {
    String quizName;
    Long duration;
    Long subjectId;
    Long totalQuestion;
    Set<Long> questionIds;
    Set<Long> questionHistoryIds;
}
