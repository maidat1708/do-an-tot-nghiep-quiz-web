package com.example.samuel_quiz.entities;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.Set;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Result {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "result_id_gen")
    @SequenceGenerator(name = "result_id_gen", sequenceName = "result_SEQ", allocationSize = 1)
    Long id;
    double score;
    Long totalQuestion;
    Long correctAnswer;
    Long examDuration;
    LocalDateTime timeStart;
    LocalDateTime timeEnd;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "quiz_id", nullable = false)
    @ToString.Exclude  // Thêm annotation này
    @EqualsAndHashCode.Exclude  // Thêm annotation này
    Quiz quiz;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @ToString.Exclude  // Thêm annotation này
    @EqualsAndHashCode.Exclude  // Thêm annotation này
    User user;

    @OneToMany(mappedBy = "result", cascade = CascadeType.ALL, orphanRemoval = true)
    @ToString.Exclude  // Thêm annotation này
    @EqualsAndHashCode.Exclude  // Thêm annotation này
    Set<ResultDetail> resultDetails;

    @ManyToOne
    @JoinColumn(name = "exam_session_id")
    private ExamSession examSession;
}
