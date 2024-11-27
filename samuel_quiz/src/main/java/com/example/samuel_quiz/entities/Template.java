package com.example.samuel_quiz.entities;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Template {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "template_id_gen")
    @SequenceGenerator(name = "template_id_gen", sequenceName = "template_SEQ", allocationSize = 1)
    Long id;
    
    String name; // Tên template
    String description; // Mô tả
    String fileType; // Loại file (WORD/PDF)
    String filePath; // Đường dẫn lưu file
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "subject_id")
    Subject subject; // Liên kết với môn học
} 