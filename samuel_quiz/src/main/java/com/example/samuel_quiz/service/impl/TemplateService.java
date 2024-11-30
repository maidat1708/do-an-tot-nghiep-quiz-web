package com.example.samuel_quiz.service.impl;

import com.example.samuel_quiz.config.TemplateProperties;
import com.example.samuel_quiz.dto.template.TemplateDTO;
import com.example.samuel_quiz.dto.template.response.TemplateResponse;
import com.example.samuel_quiz.entities.Subject;
import com.example.samuel_quiz.entities.Template;
import com.example.samuel_quiz.exception.AppException;
import com.example.samuel_quiz.exception.ErrorCode;
import com.example.samuel_quiz.mapper.TemplateMapper;
import com.example.samuel_quiz.repository.SubjectRepository;
import com.example.samuel_quiz.repository.TemplateRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.apache.kafka.common.errors.ResourceNotFoundException;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE)
@RequiredArgsConstructor
public class TemplateService {

    private final TemplateProperties templateProperties;
    private final TemplateRepository templateRepo;
    private final SubjectRepository subjectRepo;
    private final ResourceLoader resourceLoader;
    private final TemplateMapper templateMapper;

    public Template saveTemplate(TemplateDTO request) throws IOException {
        // Kiểm tra và tạo thư mục nếu chưa tồn tại
        File uploadDir = new File(templateProperties.getUploadDir());
        if (!uploadDir.exists()) {
            uploadDir.mkdirs();
        }

        // Kiểm tra kích thước file
        if (request.getFile().getSize() > templateProperties.getMaxFileSize()) {
            throw new AppException(ErrorCode.BAD_REQUEST, "File size exceeds maximum limit");
        }

        // Kiểm tra loại file
        String contentType = request.getFile().getContentType();
        if (!templateProperties.getAllowedTypes().contains(contentType)) {
            throw new AppException(ErrorCode.BAD_REQUEST, "File type not allowed");
        }

        // Tạo tên file unique
        String originalFilename = request.getFile().getOriginalFilename();
        String fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
        String fileName = UUID.randomUUID().toString() + fileExtension;
        
        // Lưu file
        Path filePath = Paths.get(uploadDir.getAbsolutePath(), fileName);
        Files.copy(request.getFile().getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        // Tạo và lưu template
        Template template = Template.builder()
            .name(request.getName())
            .description(request.getDescription())
            .fileType(contentType)
            .filePath(filePath.toString())
            .subject(subjectRepo.findById(request.getSubjectId())
                    .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND, "Subject not found")))
            .build();

        return templateRepo.save(template);
    }

    public Resource getTemplateFile(Long templateId) throws IOException {
        Template template = templateRepo.findById(templateId)
            .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND, "Template not found"));
            
        Path path = Paths.get(template.getFilePath());
        Resource resource = new FileSystemResource(path);
        
        if (resource.exists() || resource.isReadable()) {
            return resource;
        } else {
            throw new AppException(ErrorCode.NOT_FOUND, "Could not read template file");
        }
    }

    public List<TemplateResponse> getTemplatesBySubject(Long subjectId) {
        return templateRepo.findBySubjectId(subjectId).stream().map(templateMapper::toResponse).toList();
    }

    public void deleteTemplate(Long templateId) {
        Template template = templateRepo.findById(templateId)
            .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND, "Template not found"));
            
        // Xóa file
        try {
            Files.deleteIfExists(Paths.get(template.getFilePath()));
        } catch (IOException e) {
            throw new AppException(ErrorCode.UNCATEGORIZED_EXCEPTION, "Error deleting template file");
        }

        // Xóa record trong DB
        templateRepo.delete(template);
    }

    public Template getTemplate(Long templateId) {
        return templateRepo.findById(templateId)
                .orElseThrow(() -> new ResourceNotFoundException(
                    String.format("Template with id %d not found", templateId)
                ));
    }
} 