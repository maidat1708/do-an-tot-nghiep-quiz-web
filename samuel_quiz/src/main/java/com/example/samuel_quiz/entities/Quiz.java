package com.example.samuel_quiz.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
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
    Integer status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "subject_id",nullable = false)
    @ToString.Exclude // Loại bỏ khi tạo chuỗi toString (Lombok)
    @JsonIgnore // Bỏ qua khi serialize JSON (Jackson)
    Subject subject;

    @OneToMany(mappedBy = "quiz", cascade = CascadeType.ALL)
    @ToString.Exclude // Loại bỏ khi tạo chuỗi toString (Lombok)
    @JsonIgnore // Bỏ qua khi serialize JSON (Jackson)
    Set<Result> result;

    @ManyToMany(cascade = { CascadeType.PERSIST, CascadeType.MERGE })
    @JoinTable(
            name = "quiz_question_history",
            joinColumns = @JoinColumn(name = "quiz_id"),
            inverseJoinColumns = @JoinColumn(name = "question_history_id")
    )
    @ToString.Exclude // Loại bỏ khi tạo chuỗi toString (Lombok)
    @JsonIgnore // Bỏ qua khi serialize JSON (Jackson)
    Set<QuestionHistory> questionHistories;

    // Thêm tiện ích để thêm và xóa question vào quiz
    void addQuestionHistory(QuestionHistory question) {
        this.questionHistories.add(question);
        question.getQuizzes().add(this);
    }

    void removeQuestionHistory(QuestionHistory question) {
        this.questionHistories.remove(question);
        question.getQuizzes().remove(this);
    }
}
