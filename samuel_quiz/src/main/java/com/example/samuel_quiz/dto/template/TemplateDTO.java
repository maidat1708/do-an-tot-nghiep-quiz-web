package com.example.samuel_quiz.dto.template;

import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.web.multipart.MultipartFile;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class TemplateDTO {
    Long id;
    String name;
    String description; 
    String fileType;
    Long subjectId;
    MultipartFile file;
} 