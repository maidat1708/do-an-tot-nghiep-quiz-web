package com.example.samuel_quiz.mapper;

import com.example.samuel_quiz.dto.questionhistory.QuestionHistoryDTO;
import com.example.samuel_quiz.dto.questionhistory.request.QuestionHistoryUpdateRequest;
import com.example.samuel_quiz.dto.questionhistory.response.QuestionHistoryResponse;
import com.example.samuel_quiz.entities.Question;
import com.example.samuel_quiz.entities.QuestionHistory;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.Named;

@Mapper(componentModel = "spring", 
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface QuestionHistoryMapper extends BaseMapper<QuestionHistory, QuestionHistoryDTO> {

    @Mapping(target = "quizzes.questionHistories", ignore = true)
    @Mapping(target = "subject.questions", ignore = true)
    @Mapping(target = "subject.quizzes", ignore = true)
    QuestionHistoryResponse toResponse(QuestionHistory entity);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "quizzes", ignore = true)
    @Mapping(target = "answerHistories", ignore = true)
    @Mapping(target = "subject.questions", ignore = true)
    @Mapping(target = "subject.quizzes", ignore = true)
    QuestionHistory QuestionConvertToQuestionHistory(Question question);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "answerHistories", ignore = true)
    void updateQuestionHistory(@MappingTarget QuestionHistoryDTO questionHistory, QuestionHistoryUpdateRequest request);

    @Named("toDtoWithSubject")
//    @Mapping(target = "quizzes", ignore = true)
    @Mapping(target = "answerHistories", ignore = true)
    QuestionHistoryDTO toDtoWithSubject(QuestionHistory entity);

    @Named("toDtoWithQuizzes")
//    @Mapping(target = "subject", ignore = true)
    @Mapping(target = "answerHistories", ignore = true)
    QuestionHistoryDTO toDtoWithQuizzes(QuestionHistory entity);

    @Named("toDtoWithAnswerHistories")
//    @Mapping(target = "subject", ignore = true)
//    @Mapping(target = "quizzes", ignore = true)
    QuestionHistoryDTO toDtoWithAnswerHistories(QuestionHistory entity);

    @Named("toDtoWithAll")
    QuestionHistoryDTO toDtoWithAll(QuestionHistory entity);
} 