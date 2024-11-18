package com.example.samuel_quiz.mapper;

import com.example.samuel_quiz.dto.answerhistory.AnswerHistoryDTO;
import com.example.samuel_quiz.entities.Answer;
import com.example.samuel_quiz.entities.AnswerHistory;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface AnswerHistoryMapper extends BaseMapper<AnswerHistory, AnswerHistoryDTO> {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "isChoose", ignore = true)
    @Mapping(target = "questionHistory", ignore = true)
    AnswerHistory AnswerConvertToAnswerHistory(Answer answer);
}
