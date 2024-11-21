package com.example.samuel_quiz.entities;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Set;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ResultDetail {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "result_detail_id_gen")
    @SequenceGenerator(name = "result_detail_id_gen", sequenceName = "result_detail_SEQ", allocationSize = 1)
    Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "result_id")
    Result result;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_history_id")
    QuestionHistory questionHistory;
    
    @ManyToMany
    @JoinTable(
        name = "result_detail_answers",
        joinColumns = @JoinColumn(name = "result_detail_id"),
        inverseJoinColumns = @JoinColumn(name = "answer_history_id")
    )
    Set<AnswerHistory> selectedAnswers;
    
    Integer isCorrect;
} 