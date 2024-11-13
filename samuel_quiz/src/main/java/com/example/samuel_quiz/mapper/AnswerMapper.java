package com.example.samuel_quiz.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import com.example.samuel_quiz.dto.answer.request.AnswerCreateRequest;
import com.example.samuel_quiz.dto.answer.request.AnswerUpdateRequest;
import com.example.samuel_quiz.dto.answer.response.AnswerResponse;
import com.example.samuel_quiz.entities.Answer;

@Mapper(componentModel = "spring", uses = { QuestionMapper.class })
public interface AnswerMapper{

    @Mapping(target = "question", source = "question")
    AnswerResponse toAnswerResponse(Answer answer);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "question", ignore = true)
    Answer toAnswer(AnswerCreateRequest request);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "question", ignore = true)
    void updateAnswer(@MappingTarget Answer answer, AnswerUpdateRequest request);
}