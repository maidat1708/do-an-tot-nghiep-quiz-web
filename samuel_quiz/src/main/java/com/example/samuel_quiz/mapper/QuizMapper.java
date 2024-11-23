package com.example.samuel_quiz.mapper;

import com.example.samuel_quiz.dto.quiz.QuizDTO;
import com.example.samuel_quiz.dto.quiz.request.QuizCreateRequest;
import com.example.samuel_quiz.dto.quiz.request.QuizUpdateRequest;
import com.example.samuel_quiz.dto.quiz.response.QuizResponse;
import com.example.samuel_quiz.entities.Quiz;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Named;

@Mapper(componentModel = "spring")
public interface QuizMapper extends BaseMapper<Quiz, QuizDTO> {

    @Mapping(target = "subject", ignore = true)
    @Mapping(target = "questionHistories", ignore = true)
    QuizResponse toQuizResponse(QuizDTO quizDTO);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "subject", ignore = true)
    @Mapping(target = "questionHistories", ignore = true)
    QuizDTO toQuiz(QuizCreateRequest request);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "subject", ignore = true)
    @Mapping(target = "questionHistories", ignore = true)
    void updateQuiz(@MappingTarget QuizDTO quizDTO, QuizUpdateRequest request);

    @Override
    @Mapping(target = "subject", ignore = true)
    @Mapping(target = "questionHistories", ignore = true)
//    @Mapping(target = "result", ignore = true)
    QuizDTO toDto(Quiz quiz);

    @Override
    @Mapping(target = "subject", ignore = true)
    @Mapping(target = "questionHistories", ignore = true)
//    @Mapping(target = "result", ignore = true)
    Quiz toEntity(QuizDTO quizDTO);

    @Named("toDtoWithSubject")
    @Mapping(target = "questionHistories", ignore = true)
//    @Mapping(target = "result", ignore = true)
    QuizDTO toDtoWithSubject(Quiz entity);

    @Named("toDtoWithQuestionHistories")
    @Mapping(target = "subject", ignore = true)
//    @Mapping(target = "result", ignore = true)
    QuizDTO toDtoWithQuestionHistories(Quiz entity);

    @Named("toDtoWithResult")
    @Mapping(target = "subject", ignore = true)
    @Mapping(target = "questionHistories", ignore = true)
    QuizDTO toDtoWithResult(Quiz entity);

    @Named("toDtoWithAll")
    QuizDTO toDtoWithAll(Quiz entity);
}
