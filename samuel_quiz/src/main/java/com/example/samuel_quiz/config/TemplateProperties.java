package com.example.samuel_quiz.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Data
@Configuration
@ConfigurationProperties(prefix = "app.template")
public class TemplateProperties {
    private String uploadDir;
    private Long maxFileSize;
    private List<String> allowedTypes;
} 