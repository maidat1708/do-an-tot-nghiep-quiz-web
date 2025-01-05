package com.example.samuel_quiz.entities;

import com.example.samuel_quiz.enums.Role;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;
    String username;
    String password;
    String role;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    @ToString.Exclude  // Thêm annotation này
    @EqualsAndHashCode.Exclude  // Thêm annotation này
    Profile profile;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @ToString.Exclude  // Thêm annotation này
    @EqualsAndHashCode.Exclude  // Thêm annotation này
    Set<Result> results;

    // Thêm quan hệ với ExamSession cho giáo viên
    @ManyToMany(mappedBy = "teachers")
    @JsonIgnore
    private Set<ExamSession> teachingExamSessions = new HashSet<>();

    // Thêm quan hệ với ExamSession cho học sinh
    @ManyToMany(mappedBy = "students")
    @JsonIgnore
    private Set<ExamSession> enrolledExamSessions = new HashSet<>();

    // Thêm các phương thức tiện ích
    public void addTeachingExamSession(ExamSession examSession) {
        this.teachingExamSessions.add(examSession);
        examSession.getTeachers().add(this);
    }

    public void removeTeachingExamSession(ExamSession examSession) {
        this.teachingExamSessions.remove(examSession);
        examSession.getTeachers().remove(this);
    }

    public void addEnrolledExamSession(ExamSession examSession) {
        this.enrolledExamSessions.add(examSession);
        examSession.getStudents().add(this);
    }

    public void removeEnrolledExamSession(ExamSession examSession) {
        this.enrolledExamSessions.remove(examSession);
        examSession.getStudents().remove(this);
    }

    // Thêm phương thức kiểm tra xung đột thời gian
    public boolean hasTimeConflict(LocalDateTime startTime, LocalDateTime endTime) {
        Set<ExamSession> allSessions = new HashSet<>();
        if (Role.valueOf(role) == Role.TEACHER) {
            allSessions.addAll(teachingExamSessions);
        } else if (Role.valueOf(role) == Role.STUDENT) {
            allSessions.addAll(enrolledExamSessions);
        }

        return allSessions.stream()
                .anyMatch(session -> {
                    return !(session.getEndTime().isBefore(startTime) ||
                            session.getStartTime().isAfter(endTime));
                });
    }

    // Thêm phương thức lấy danh sách ca thi sắp diễn ra
    public List<ExamSession> getUpcomingExamSessions() {
        Set<ExamSession> relevantSessions = Role.valueOf(role) == Role.TEACHER ?
                teachingExamSessions : enrolledExamSessions;

        LocalDateTime now = LocalDateTime.now();
        return relevantSessions.stream()
                .filter(session -> session.getStartTime().isAfter(now))
                .sorted(Comparator.comparing(ExamSession::getStartTime))
                .collect(Collectors.toList());
    }

    // Thêm phương thức kiểm tra quyền với ca thi
    public boolean canAccessExamSession(ExamSession examSession) {
        if (Role.valueOf(role) == Role.TEACHER) {
            return examSession.getTeachers().contains(this);
        } else if (Role.valueOf(role) == Role.STUDENT) {
            return examSession.getStudents().contains(this);
        }
        return false;
    }
}
