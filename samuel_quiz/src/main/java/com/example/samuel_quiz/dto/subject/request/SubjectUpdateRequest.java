package com.example.samuel_quiz.dto.subject.request;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SubjectUpdateRequest {
    String subjectName; // Tên Subject
    String description; // Mô tả
}
