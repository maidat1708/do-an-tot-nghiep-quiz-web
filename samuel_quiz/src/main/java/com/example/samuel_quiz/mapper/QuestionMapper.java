package com.example.samuel_quiz.mapper;

import com.example.samuel_quiz.dto.question.QuestionDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import com.example.samuel_quiz.dto.question.request.QuestionCreateRequest;
import com.example.samuel_quiz.dto.question.request.QuestionUpdateRequest;
import com.example.samuel_quiz.dto.question.response.QuestionResponse;
import com.example.samuel_quiz.entities.Question;

@Mapper(componentModel = "spring")
public interface QuestionMapper extends BaseMapper<Question, QuestionDTO> {

    @Mapping(target = "subject", source = "subject") // Lấy thông tin chi tiết của môn học
    @Mapping(target = "answers", source = "answers") // Lấy danh sách các đáp án liên kết
    @Mapping(target = "quizzes", source = "quizzes") // Lấy danh sách các quiz liên kết
    QuestionResponse toQuestionResponse(Question question);

    @Mapping(target = "id", ignore = true) // ID sẽ được tự động tạo
    @Mapping(target = "subject", ignore = true) // Subject sẽ được xử lý riêng
    @Mapping(target = "answers", ignore = true) // Answers sẽ được xử lý riêng
    @Mapping(target = "quizzes", ignore = true) // Quizzes sẽ được xử lý riêng
    Question toQuestion(QuestionCreateRequest request);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "subject", ignore = true)
    @Mapping(target = "answers", ignore = true)
    @Mapping(target = "quizzes", ignore = true)
    void updateQuestion(@MappingTarget Question question, QuestionUpdateRequest request);
}

