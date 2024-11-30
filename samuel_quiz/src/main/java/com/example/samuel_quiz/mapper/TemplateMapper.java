package com.example.samuel_quiz.mapper;

import com.example.samuel_quiz.dto.template.TemplateDTO;
import com.example.samuel_quiz.dto.template.response.TemplateResponse;
import com.example.samuel_quiz.entities.Template;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface TemplateMapper {

    TemplateResponse toResponse(Template template);
}