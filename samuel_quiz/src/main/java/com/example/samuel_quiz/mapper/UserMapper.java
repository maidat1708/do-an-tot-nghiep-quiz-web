package com.example.samuel_quiz.mapper;

import com.example.samuel_quiz.dto.profile.ProfileDTO;
import com.example.samuel_quiz.dto.user.UserDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import com.example.samuel_quiz.dto.user.response.UserResponse;
import com.example.samuel_quiz.dto.user.request.UserCreateRequest;
import com.example.samuel_quiz.dto.user.request.UserUpdateRequest;
import com.example.samuel_quiz.entities.User;
import org.mapstruct.Named;

@Mapper(componentModel = "spring") // componentModel = "spring" -> create bean -> DI 
public interface UserMapper extends BaseMapper<User, UserDTO> {
    @Mapping(target = "role", ignore =  true) // ko map roles
    @Mapping(target = "id", ignore =  true)
    @Mapping(target = "results", ignore =  true)
    @Mapping(target = "profile",ignore = true) // ánh xạ nested profile
    UserDTO toUser(UserCreateRequest request);

    UserResponse tUserResponse(UserDTO user);

    @Mapping(target = "role", ignore =  true) // ko map roles
    @Mapping(target = "id", ignore =  true)
    @Mapping(target = "profile", ignore =  true)
    void updateUser(@MappingTarget UserDTO user, UserUpdateRequest request);

}
