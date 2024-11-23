package com.example.samuel_quiz.mapper;

import com.example.samuel_quiz.dto.profile.ProfileDTO;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public interface BaseMapper<E, D> {
    D toDto(E entity);

    E toEntity(D dto);

    List<E> toListEntity(List<D> dtoList);

    List<D> toListDto(List<E> entities);

}

