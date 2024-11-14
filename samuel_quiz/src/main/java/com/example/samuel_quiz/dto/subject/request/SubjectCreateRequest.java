package com.example.samuel_quiz.dto.subject.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SubjectCreateRequest {
    String subjectName; // Tên Subject
    String description; // Mô tả
}
