package com.example.samuel_quiz.dto.answer.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AnswerTextResponse {
    Long id;
    String answerText;
}
