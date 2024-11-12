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
public class Question {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "question_id_gen")
    @SequenceGenerator(name = "question_id_gen", sequenceName = "question_SEQ", allocationSize = 1)
    Long id;
    String questionText;
    Integer level;

    @OneToMany(mappedBy = "question", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    Set<Answer> answers;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "subject_id", nullable = false)
    Subject subject;

    @ManyToMany(mappedBy = "questions", cascade = { CascadeType.PERSIST, CascadeType.MERGE })
    Set<Quiz> quizzes;
    // Set<Quiz> quizzes = new HashSet<>();
    
    void addQuiz(Quiz quiz) {
        this.quizzes.add(quiz);
        quiz.getQuestions().add(this);
    }

    void removeQuiz(Quiz quiz) {
        this.quizzes.remove(quiz);
        quiz.getQuestions().remove(this);
    }
}
