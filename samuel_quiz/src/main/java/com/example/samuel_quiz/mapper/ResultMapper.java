package com.example.samuel_quiz.mapper;

import com.example.samuel_quiz.dto.answerhistory.AnswerHistoryDTO;
import com.example.samuel_quiz.dto.result.ResultDTO;
import com.example.samuel_quiz.dto.result.ResultDetailDTO;
import com.example.samuel_quiz.dto.result.request.ResultCreateRequest;
import com.example.samuel_quiz.dto.result.request.ResultUpdateRequest;
import com.example.samuel_quiz.dto.result.response.*;
import com.example.samuel_quiz.entities.Result;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring", uses = {UserMapper.class, QuizMapper.class})
public interface ResultMapper extends BaseMapper<Result, ResultDTO> {

    @Override
    @Mapping(target = "user", qualifiedByName = "toDto")
    ResultDTO toDto(Result entity);

    @Override
    @Mapping(target = "user", qualifiedByName = "toEntity")
    Result toEntity(ResultDTO dto);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "quiz", ignore = true)
    ResultDTO toDtoCreateRequest(ResultCreateRequest request);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "quiz", ignore = true)
    void updateResultDTO(@MappingTarget ResultDTO result, ResultUpdateRequest request);

    @Mapping(target = "quizId", source = "quiz.id")
    @Mapping(target = "userId", source = "user.id")
    @Mapping(target = "submitTime", source = "timeEnd")
    @Mapping(target = "timeStart", source = "timeStart")
    @Mapping(target = "examDuration", source = "examDuration")
    @Mapping(target = "totalCorrect", source = "correctAnswer")
    @Mapping(target = "questionResults", source = "resultDetails")
    @Mapping(target = "quizName", source = "quiz.quizName")
    ResultResponse toResultResponse(ResultDTO resultDTO);

    @Mapping(target = "quizId", source = "quiz.id")
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "submitTime", source = "timeEnd")
    @Mapping(target = "timeStart", source = "timeStart")
    @Mapping(target = "examDuration", source = "examDuration")
    @Mapping(target = "totalCorrect", source = "correctAnswer")
    @Mapping(target = "questionResults", source = "resultDetails")
    @Mapping(target = "quizName", source = "quiz.quizName")
    ResultStatusResponse toResultStatusResponse(ResultDTO resultDTO);

    @Mapping(target = "quizId", source = "quiz.id")
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "submitTime", source = "timeEnd")
    @Mapping(target = "timeStart", source = "timeStart")
    @Mapping(target = "examDuration", source = "examDuration")
    @Mapping(target = "totalCorrect", source = "correctAnswer")
    @Mapping(target = "questionResults", source = "resultDetails")
    @Mapping(target = "quizName", source = "quiz.quizName")
    ResultExamSessionResponse toResultExamSessionResponse(ResultDTO resultDTO);

    @Mapping(target = "questionText", source = "questionHistory.questionText")
    @Mapping(target = "selectedAnswers", source = "selectedAnswers")
    @Mapping(target = "answers", source = "questionHistory.answerHistories")
    @Mapping(target = "isCorrect", source = "isCorrect")
    QuestionResultResponse toQuestionResultResponse(ResultDetailDTO resultDetailDTO);

    @Mapping(target = "id", source = "id")
    @Mapping(target = "answerText", source = "answerText")
    @Mapping(target = "isCorrect", source = "isCorrect")
    AnswerResultResponse toAnswerResultResponse(AnswerHistoryDTO answerHistoryDTO);
}