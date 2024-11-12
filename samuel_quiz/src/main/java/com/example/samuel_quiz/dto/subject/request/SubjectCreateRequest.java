package com.example.samuel_quiz.dto.subject.request;

import lombok.Data;

@Data
public class SubjectCreateRequest {
    String subjectName; // Tên Subject
    String description; // Mô tả
}
