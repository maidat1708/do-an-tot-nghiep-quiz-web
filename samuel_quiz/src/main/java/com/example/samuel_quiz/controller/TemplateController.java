package com.example.samuel_quiz.controller;

import com.example.samuel_quiz.dto.template.TemplateDTO;
import com.example.samuel_quiz.dto.auth.response.APIResponse;
import com.example.samuel_quiz.service.impl.TemplateService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("templates")
@FieldDefaults(level = AccessLevel.PRIVATE)
@Tag(name = "TEMPLATE", description = "Quản lý template import")
public class TemplateController {

    final TemplateService templateService;

    public TemplateController(TemplateService templateService) {
        this.templateService = templateService;
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public APIResponse<?> uploadTemplate(@ModelAttribute TemplateDTO request) throws IOException {
        return APIResponse.builder()
                .result(templateService.saveTemplate(request))
                .build();
    }

    @GetMapping("/{templateId}/download")
    public ResponseEntity<ByteArrayResource> downloadTemplate(@PathVariable Long templateId) throws IOException {
        byte[] data = templateService.getTemplateFile(templateId).getContentAsByteArray();
        ByteArrayResource resource = new ByteArrayResource(data);
        
        return ResponseEntity
                .ok()
                .contentLength(data.length)
                .header("Content-type", "application/octet-stream")
                .header("Content-disposition", "attachment; filename=\"template.docx\"")
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
} 