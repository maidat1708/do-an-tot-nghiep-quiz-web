package com.example.samuel_quiz.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import com.example.samuel_quiz.dto.result.request.ResultCreateRequest;
import com.example.samuel_quiz.dto.result.request.ResultUpdateRequest;
import com.example.samuel_quiz.dto.result.response.ResultResponse;
import com.example.samuel_quiz.entities.Result;

@Mapper(componentModel = "spring")
public interface ResultMapper {
    // Chuyển đổi từ Result Entity sang ResultResponse DTO
    ResultResponse toResultResponse(Result result);

    // Chuyển đổi từ ResultCreateRequest sang Result Entity
    @Mapping(target = "id", ignore = true) // Bỏ qua ID vì nó được tự động tạo
    @Mapping(target = "user", ignore = true) // Bỏ qua User vì sẽ được xử lý riêng
    @Mapping(target = "quiz", ignore = true) // Bỏ qua Quiz vì sẽ được xử lý riêng
    Result toResult(ResultCreateRequest request);

    // Cập nhật Result từ ResultUpdateRequest
    @Mapping(target = "id", ignore = true) // Bỏ qua ID vì nó không được phép cập nhật
    @Mapping(target = "user", ignore = true) // Bỏ qua User vì nó không được phép cập nhật
    @Mapping(target = "quiz", ignore = true) // Bỏ qua Quiz vì nó không được phép cập nhật
    void updateResult(@MappingTarget Result result, ResultUpdateRequest request);
}
