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
public class Quiz {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "quiz_id_gen")
    @SequenceGenerator(name = "quiz_id_gen", sequenceName = "quiz_SEQ", allocationSize = 1)
    Long id;
    String quizName;
    Long totalQuestion;
    Long duration; // thoi gian lam bai

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "subject_id",nullable = false)
    Subject subject;

    @OneToMany(mappedBy = "quiz", cascade = CascadeType.ALL)
    Set<Result> result;

    @ManyToMany(cascade = { CascadeType.PERSIST, CascadeType.MERGE })
    @JoinTable(
            name = "quiz_question",
            joinColumns = @JoinColumn(name = "quiz_id"),
            inverseJoinColumns = @JoinColumn(name = "question_id")
    )
    Set<Question> questions;

    // Thêm tiện ích để thêm và xóa question vào quiz
    void addQuestion(Question question) {
        this.questions.add(question);
        question.getQuizzes().add(this);
    }

    void removeQuestion(Question question) {
        this.questions.remove(question);
        question.getQuizzes().remove(this);
    }
}
