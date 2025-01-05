package com.example.samuel_quiz.entities;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

import com.example.samuel_quiz.entities.Quiz;
import com.example.samuel_quiz.entities.User;

@Entity
@Table(name = "exam_sessions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExamSession {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;
    
    @Column(nullable = false)
    private LocalDateTime startTime;
    
    @Column(nullable = false) 
    private LocalDateTime endTime;

    @ManyToOne
    @JoinColumn(name = "quiz_id", nullable = false)
    private Quiz quiz;

    @ManyToMany
    @JoinTable(
        name = "exam_session_teachers",
        joinColumns = @JoinColumn(name = "exam_session_id"),
        inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private Set<User> teachers = new HashSet<>();

    @ManyToMany
    @JoinTable(
        name = "exam_session_students", 
        joinColumns = @JoinColumn(name = "exam_session_id"),
        inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private Set<User> students = new HashSet<>();
} 