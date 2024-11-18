package com.example.samuel_quiz.mapper;

import com.example.samuel_quiz.dto.question.QuestionDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import com.example.samuel_quiz.dto.question.request.QuestionCreateRequest;
import com.example.samuel_quiz.dto.question.request.QuestionUpdateRequest;
import com.example.samuel_quiz.dto.question.response.QuestionResponse;
import com.example.samuel_quiz.entities.Question;

@Mapper(componentModel = "spring")
public interface QuestionMapper extends BaseMapper<Question, QuestionDTO> {

    QuestionResponse toQuestionResponse(QuestionDTO question);

    @Mapping(target = "id", ignore = true) // ID sẽ được tự động tạo
    QuestionDTO toQuestion(QuestionCreateRequest request);

    @Mapping(target = "id", ignore = true)
    void updateQuestion(@MappingTarget QuestionDTO question, QuestionUpdateRequest request);
}

