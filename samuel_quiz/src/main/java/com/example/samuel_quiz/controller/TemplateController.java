package com.example.samuel_quiz.controller;

import com.example.samuel_quiz.dto.template.TemplateDTO;
import com.example.samuel_quiz.dto.auth.response.APIResponse;
import com.example.samuel_quiz.entities.Template;
import com.example.samuel_quiz.service.impl.TemplateService;
import com.example.samuel_quiz.service.impl.QuizTemplateService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;

@RestController
@RequestMapping("templates")
@FieldDefaults(level = AccessLevel.PRIVATE)
@Tag(name = "TEMPLATE", description = "Quản lý template import")
public class TemplateController {

    final TemplateService templateService;
    final QuizTemplateService quizTemplateService;

    public TemplateController(TemplateService templateService, QuizTemplateService quizTemplateService) {
        this.templateService = templateService;
        this.quizTemplateService = quizTemplateService;
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public APIResponse<?> uploadTemplate(@ModelAttribute TemplateDTO request) throws IOException {
        return APIResponse.builder()
                .result(templateService.saveTemplate(request))
                .build();
    }

    @GetMapping("/{templateId}/download")
    public ResponseEntity<ByteArrayResource> downloadTemplate(@PathVariable Long templateId) throws IOException {
        Template template = templateService.getTemplate(templateId);
        byte[] data = templateService.getTemplateFile(templateId).getContentAsByteArray();
        ByteArrayResource resource = new ByteArrayResource(data);
        
        String contentType;
        String extension;
        
        if (template.getFileType().equals("application/vnd.openxmlformats-officedocument.wordprocessingml.document")) {
            contentType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
            extension = ".docx";
        } else if (template.getFileType().equals("application/pdf")) {
            contentType = "application/pdf";
            extension = ".pdf";
        } else {
            contentType = "application/octet-stream";
            extension = "";
        }

        return ResponseEntity
                .ok()
                .contentLength(data.length)
                .header("Content-Type", contentType)
                .header("Content-Disposition", "attachment; filename=\"template" + extension + "\"")
                .body(resource);
    }

    @GetMapping("/subject/{subjectId}")
    public APIResponse<?> getTemplatesBySubject(@PathVariable Long subjectId) {
        return APIResponse.builder()
                .result(templateService.getTemplatesBySubject(subjectId))
                .build();
    }

    @DeleteMapping("/{templateId}")
    public APIResponse<?> deleteTemplate(@PathVariable Long templateId) {
        templateService.deleteTemplate(templateId);
        return APIResponse.builder().build();
    }

    @GetMapping("/sample/word")
    public ResponseEntity<ByteArrayResource> getWordTemplate() throws IOException {
        byte[] data = quizTemplateService.generateWordTemplate();
        ByteArrayResource resource = new ByteArrayResource(data);
        
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.wordprocessingml.document"))
                .header("Content-Disposition", "attachment; filename=quiz_template.docx")
                .contentLength(data.length)
                .body(resource);
    }

    @GetMapping("/sample/pdf")
    public ResponseEntity<ByteArrayResource> getPDFTemplate() throws IOException {
        byte[] data = quizTemplateService.generatePDFTemplate();
        ByteArrayResource resource = new ByteArrayResource(data);
        
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header("Content-Disposition", "attachment; filename=quiz_template.pdf")
                .contentLength(data.length)
                .body(resource);
    }

    @GetMapping("/{templateId}/preview")
    public ResponseEntity<InputStreamResource> previewTemplate(@PathVariable Long templateId) throws IOException {
        Template template = templateService.getTemplate(templateId);
        File file = new File(template.getFilePath());
        InputStreamResource resource = new InputStreamResource(new FileInputStream(file));
        
        return ResponseEntity.ok()
                .contentLength(file.length())
                .contentType(MediaType.parseMediaType(template.getFileType()))
                .header("Content-Disposition", "inline")
                .body(resource);
    }
} 