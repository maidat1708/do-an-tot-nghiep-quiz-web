package com.example.samuel_quiz.mapper;

import com.example.samuel_quiz.dto.result.ResultDetailDTO;
import com.example.samuel_quiz.entities.ResultDetail;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ResultDetailMapper extends BaseMapper<ResultDetail, ResultDetailDTO> {
    @Mapping(target = "questionHistory", source = "questionHistory")
    ResultDetailDTO toDto(ResultDetail entity);
} 