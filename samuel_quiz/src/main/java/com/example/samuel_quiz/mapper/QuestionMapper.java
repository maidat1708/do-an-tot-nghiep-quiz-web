package com.example.samuel_quiz.mapper;

import com.example.samuel_quiz.dto.question.QuestionDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Named;

import com.example.samuel_quiz.dto.question.request.QuestionCreateRequest;
import com.example.samuel_quiz.dto.question.request.QuestionUpdateRequest;
import com.example.samuel_quiz.dto.question.response.QuestionResponse;
import com.example.samuel_quiz.entities.Question;

@Mapper(componentModel = "spring")
public interface QuestionMapper extends BaseMapper<Question, QuestionDTO> {

    @Mapping(target = "subject.questions", ignore = true)
    QuestionResponse toQuestionResponse(QuestionDTO question);

    @Mapping(target = "id", ignore = true)
    QuestionDTO toQuestion(QuestionCreateRequest request);

    @Mapping(target = "id", ignore = true)
    void updateQuestion(@MappingTarget QuestionDTO question, QuestionUpdateRequest request);

    @Mapping(target = "subject.questions", ignore = true)
    QuestionDTO toDto(Question question);

    @Mapping(target = "subject.questions", ignore = true)
    Question toEntity(QuestionDTO questionDTO);

    @Named("toDtoWithSubject")
    @Mapping(target = "answers", ignore = true)
    QuestionDTO toDtoWithSubject(Question entity);

    @Named("toDtoWithAnswers")
    @Mapping(target = "subject", ignore = true)
    QuestionDTO toDtoWithAnswers(Question entity);

    @Named("toDtoWithAll")
    QuestionDTO toDtoWithAll(Question entity);
}

