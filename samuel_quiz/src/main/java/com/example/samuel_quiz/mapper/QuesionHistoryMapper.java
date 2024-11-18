package com.example.samuel_quiz.mapper;

import com.example.samuel_quiz.dto.questionhistory.QuestionHistoryDTO;
import com.example.samuel_quiz.entities.Question;
import com.example.samuel_quiz.entities.QuestionHistory;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface QuesionHistoryMapper extends BaseMapper<QuestionHistory, QuestionHistoryDTO> {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "answerHistories", ignore = true)
    @Mapping(target = "quizzes", ignore = true)
    QuestionHistory QuestionConvertToQuestionHistory(Question question);

}
