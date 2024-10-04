package com.example.samuel_quiz.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import com.example.samuel_quiz.dto.request.UserCreateRequest;
import com.example.samuel_quiz.dto.request.UserUpdateRequest;
import com.example.samuel_quiz.dto.response.UserResponse;
import com.example.samuel_quiz.entities.User;

@Mapper(componentModel = "spring") // componentModel = "spring" -> create bean -> DI 
public interface UserMapper {
    @Mapping(target = "roles", ignore =  true) // ko map roles 
    @Mapping(target = "id", ignore =  true)
    User toUser(UserCreateRequest request);
    UserResponse tUserResponse(User user);
    @Mapping(target = "roles", ignore =  true) // ko map roles 
    @Mapping(target = "id", ignore =  true) 
    void updateUser(@MappingTarget User user, UserUpdateRequest request);
}
