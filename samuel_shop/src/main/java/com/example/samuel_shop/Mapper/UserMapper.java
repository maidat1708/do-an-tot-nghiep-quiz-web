package com.example.samuel_shop.Mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import com.example.samuel_shop.DTO.Request.UserCreateRequest;
import com.example.samuel_shop.DTO.Request.UserUpdateRequest;
import com.example.samuel_shop.DTO.Response.UserResponse;
import com.example.samuel_shop.Entities.User;

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
