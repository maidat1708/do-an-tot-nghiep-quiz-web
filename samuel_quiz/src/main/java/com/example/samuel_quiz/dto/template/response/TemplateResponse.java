package com.example.samuel_quiz.dto.template.response;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class TemplateResponse {
    Long id;
    String name; // Tên template
    String description; // Mô tả
    String fileType; // Loại file (WORD/PDF)
    String filePath; // Đường dẫn lưu file
}
