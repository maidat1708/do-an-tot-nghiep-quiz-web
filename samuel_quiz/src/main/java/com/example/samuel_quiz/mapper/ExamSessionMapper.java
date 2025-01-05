package com.example.samuel_quiz.mapper;

import com.example.samuel_quiz.dto.examsession.response.ExamSessionResponse;
import com.example.samuel_quiz.entities.ExamSession;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {QuizMapper.class, UserMapper.class})
public interface ExamSessionMapper {
    
    @Mapping(source = "quiz", target = "quiz")
    @Mapping(source = "teachers", target = "teachers")
    @Mapping(source = "students", target = "students")
    ExamSessionResponse toResponse(ExamSession examSession);
} 