package com.example.samuel_quiz.mapper;

import com.example.samuel_quiz.dto.subject.SubjectDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Named;

import com.example.samuel_quiz.dto.subject.request.SubjectCreateRequest;
import com.example.samuel_quiz.dto.subject.request.SubjectUpdateRequest;
import com.example.samuel_quiz.dto.subject.response.SubjectResponse;
import com.example.samuel_quiz.entities.Subject;

@Mapper(componentModel = "spring")
public interface SubjectMapper extends BaseMapper<Subject, SubjectDTO> {

    @Mapping(target = "quizzes", ignore = true)
    @Mapping(target = "questions", ignore = true)
    SubjectResponse toSubjectResponse(SubjectDTO subject);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "quizzes", ignore = true)
    @Mapping(target = "questions", ignore = true)
    SubjectDTO toSubject(SubjectCreateRequest request);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "quizzes", ignore = true)
    @Mapping(target = "questions", ignore = true)
    void updateSubject(@MappingTarget SubjectDTO subject, SubjectUpdateRequest request);

    @Override
    @Mapping(target = "quizzes", ignore = true)
    @Mapping(target = "questions", ignore = true)
    SubjectDTO toDto(Subject subject);

    @Override
    @Mapping(target = "quizzes", ignore = true)
    @Mapping(target = "questions", ignore = true)
    Subject toEntity(SubjectDTO subjectDTO);

    @Named("toDtoWithQuizzes")
    @Mapping(target = "questions", ignore = true)
    SubjectDTO toDtoWithQuizzes(Subject entity);

    @Named("toDtoWithQuestions")
    @Mapping(target = "quizzes", ignore = true)
    SubjectDTO toDtoWithQuestions(Subject entity);

    @Named("toDtoWithAll")
    SubjectDTO toDtoWithAll(Subject entity);
}
