package com.example.samuel_quiz.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import com.example.samuel_quiz.dto.quiz.request.QuizCreateRequest;
import com.example.samuel_quiz.dto.quiz.request.QuizUpdateRequest;
import com.example.samuel_quiz.dto.quiz.response.QuizResponse;
import com.example.samuel_quiz.entities.Quiz;

@Mapper(componentModel = "spring"
, uses = { SubjectMapper.class, QuestionMapper.class, ResultMapper.class } // checkthem
)
public interface QuizMapper {

    @Mapping(target = "subject", source = "subject") // Lấy thông tin chi tiết của Subject
    @Mapping(target = "questions", source = "questions") // Lấy danh sách các câu hỏi liên kết
    @Mapping(target = "result", source = "result") // Lấy thông tin kết quả
    QuizResponse toQuizResponse(Quiz quiz);

    @Mapping(target = "id", ignore = true) 
    @Mapping(target = "subject", ignore = true) // Bỏ qua Subject vì sẽ được xử lý riêng
    @Mapping(target = "result", ignore = true) // Bỏ qua Result vì không tạo cùng Quiz
    @Mapping(target = "questions", ignore = true) // Bỏ qua Questions vì sẽ xử lý riêng
    Quiz toQuiz(QuizCreateRequest request);

    @Mapping(target = "id", ignore = true) 
    @Mapping(target = "subject", ignore = true) // Bỏ qua Subject vì không cập nhật
    @Mapping(target = "result", ignore = true) // Bỏ qua Result vì không cập nhật
    @Mapping(target = "questions", ignore = true) // Bỏ qua Questions vì sẽ xử lý riêng
    void updateQuiz(@MappingTarget Quiz quiz, QuizUpdateRequest request);
}
