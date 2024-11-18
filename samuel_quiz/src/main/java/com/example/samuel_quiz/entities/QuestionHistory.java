package com.example.samuel_quiz.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Objects;
import java.util.Set;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class QuestionHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "question_history_id_gen")
    @SequenceGenerator(name = "question_history_id_gen", sequenceName = "question_history_SEQ", allocationSize = 1)
    Long id;
    String questionText;
    Integer level;

    @OneToMany(mappedBy = "questionHistory", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @ToString.Exclude // Loại bỏ khi tạo chuỗi toString (Lombok)
    @JsonIgnore // Bỏ qua khi serialize JSON (Jackson)
    Set<AnswerHistory> answerHistories;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "subject_id", nullable = false)
    @ToString.Exclude // Loại bỏ khi tạo chuỗi toString (Lombok)
    @JsonIgnore // Bỏ qua khi serialize JSON (Jackson)
    Subject subject;

    @ManyToMany(mappedBy = "questionHistories", cascade = { CascadeType.PERSIST, CascadeType.MERGE })
    @ToString.Exclude // Loại bỏ khi tạo chuỗi toString (Lombok)
    @JsonIgnore // Bỏ qua khi serialize JSON (Jackson)
    Set<Quiz> quizzes;
    // Set<Quiz> quizzes = new HashSet<>();
    
    void addQuiz(Quiz quiz) {
        this.quizzes.add(quiz);
        quiz.getQuestionHistories().add(this);
    }

    void removeQuiz(Quiz quiz) {
        this.quizzes.remove(quiz);
        quiz.getQuestionHistories().remove(this);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof QuestionHistory question)) return false;
        return Objects.equals(id, question.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(questionText);
    }
}
