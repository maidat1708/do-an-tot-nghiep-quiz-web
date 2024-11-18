package com.example.samuel_quiz.entities;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AnswerHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "answer_history_id_gen")
    @SequenceGenerator(name = "answer_history_id_gen", sequenceName = "answer_history_SEQ", allocationSize = 1)
    Long id;
    String answerText;
    Integer isCorrect;
    Integer isChoose;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_history_id", nullable = false)
    QuestionHistory questionHistory;
}
