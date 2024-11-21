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

@Mapper(componentModel = "spring", 
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface QuestionHistoryMapper extends BaseMapper<QuestionHistory, QuestionHistoryDTO> {

    @Mapping(target = "subject", source = "subject")
    @Mapping(target = "answerHistories", source = "answerHistories")
    QuestionHistoryResponse toResponse(QuestionHistory entity);

    // Convert từ Question sang QuestionHistory
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "quizzes", ignore = true)
    @Mapping(target = "answerHistories", ignore = true)
    QuestionHistory QuestionConvertToQuestionHistory(Question question);

    // Update QuestionHistory từ request
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "answerHistories", ignore = true)
    void updateQuestionHistory(@MappingTarget QuestionHistoryDTO questionHistory, QuestionHistoryUpdateRequest request);
} 