package com.example.samuel_quiz.mapper;

import com.example.samuel_quiz.dto.quiz.QuizDTO;
import com.example.samuel_quiz.dto.quiz.request.QuizCreateRequest;
import com.example.samuel_quiz.dto.quiz.request.QuizUpdateRequest;
import com.example.samuel_quiz.dto.quiz.response.QuizResponse;
import com.example.samuel_quiz.entities.Quiz;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface QuizMapper extends BaseMapper<Quiz, QuizDTO> {

    // Chuyển đổi từ QuizDTO sang QuizResponse
    @Mapping(target = "subject", source = "subject") // Lấy thông tin chi tiết của Subject
    @Mapping(target = "questions", source = "questions") // Lấy danh sách các câu hỏi liên kết
    @Mapping(target = "result", source = "result") // Lấy thông tin kết quả
    QuizResponse toQuizResponse(QuizDTO quizDTO);

    // Chuyển đổi từ QuizCreateRequest sang QuizDTO
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "subject", ignore = true) // Bỏ qua Subject vì không cập nhật
    @Mapping(target = "result", ignore = true) // Bỏ qua Result vì không cập nhật
    @Mapping(target = "questions", ignore = true) // Bỏ qua Questions vì sẽ xử lý riêng
    QuizDTO toQuiz(QuizCreateRequest request);

    // Cập nhật QuizDTO từ QuizUpdateRequest
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "subject", ignore = true) // Bỏ qua Subject vì không cập nhật
    @Mapping(target = "result", ignore = true) // Bỏ qua Result vì không cập nhật
    @Mapping(target = "questions", ignore = true) // Bỏ qua Questions vì sẽ xử lý riêng
    void updateQuiz(@MappingTarget QuizDTO quizDTO, QuizUpdateRequest request);
}
