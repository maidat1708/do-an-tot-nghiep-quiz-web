package com.example.samuel_quiz.mapper;

import com.example.samuel_quiz.dto.result.ResultDTO;
import com.example.samuel_quiz.dto.result.request.ResultCreateRequest;
import com.example.samuel_quiz.dto.result.request.ResultUpdateRequest;
import com.example.samuel_quiz.dto.result.response.ResultResponse;
import com.example.samuel_quiz.entities.Result;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface ResultMapper extends BaseMapper<Result, ResultDTO> {

    // Chuyển đổi từ ResultDTO sang ResultResponse
    @Mapping(target = "user", source = "user") // Map đối tượng User
    @Mapping(target = "quiz", source = "quiz") // Map đối tượng Quiz
    ResultResponse toResultResponse(ResultDTO result);

    // Chuyển đổi từ ResultCreateRequest sang ResultDTO
    @Mapping(target = "id", ignore = true) // ID sẽ được tự động tạo
    @Mapping(target = "user", ignore = true) // User sẽ được xử lý riêng
    @Mapping(target = "quiz", ignore = true) // Quiz sẽ được xử lý riêng
    ResultDTO toResult(ResultCreateRequest request);

    // Cập nhật ResultDTO từ ResultUpdateRequest
    @Mapping(target = "id", ignore = true) // Bỏ qua ID vì không được phép cập nhật
    @Mapping(target = "user", ignore = true) // Bỏ qua User vì không được phép cập nhật
    @Mapping(target = "quiz", ignore = true) // Bỏ qua Quiz vì không được phép cập nhật
    void updateResult(@MappingTarget ResultDTO result, ResultUpdateRequest request);
}