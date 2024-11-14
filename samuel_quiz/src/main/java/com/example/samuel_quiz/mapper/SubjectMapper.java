package com.example.samuel_quiz.mapper;

import com.example.samuel_quiz.dto.subject.SubjectDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import com.example.samuel_quiz.dto.subject.request.SubjectCreateRequest;
import com.example.samuel_quiz.dto.subject.request.SubjectUpdateRequest;
import com.example.samuel_quiz.dto.subject.response.SubjectResponse;
import com.example.samuel_quiz.entities.Subject;

@Mapper(componentModel = "spring")
public interface SubjectMapper extends BaseMapper<Subject, SubjectDTO> {

    @Mapping(target = "quizzes", source = "quizzes") // Map danh sách Quiz
    @Mapping(target = "questions", source = "questions") // Map danh sách Question
    SubjectResponse toSubjectResponse(SubjectDTO subject);

    @Mapping(target = "id", ignore = true) // ID sẽ được tự động tạo
    @Mapping(target = "quizzes", ignore = true) // Quizzes sẽ được xử lý riêng
    @Mapping(target = "questions", ignore = true) // Questions sẽ được xử lý riêng
    SubjectDTO toSubject(SubjectCreateRequest request);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "quizzes", ignore = true)
    @Mapping(target = "questions", ignore = true)
    void updateSubject(@MappingTarget SubjectDTO subject, SubjectUpdateRequest request);
}
