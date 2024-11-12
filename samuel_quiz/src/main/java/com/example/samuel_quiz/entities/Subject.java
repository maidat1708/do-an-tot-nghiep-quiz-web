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
public class Subject {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "subject_id_gen")
    @SequenceGenerator(name = "subject_id_gen", sequenceName = "subject_SEQ", allocationSize = 1)
    Long id;
    String subjectName;
    String description;
    @OneToMany(mappedBy = "subject", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    Set<Quiz> quizzes;

    @OneToMany(mappedBy = "subject",cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    Set<Question> questions;
}
