package com.example.samuel_shop.Service;

import java.util.List;

import com.example.samuel_shop.DTO.Request.UserCreateRequest;
import com.example.samuel_shop.DTO.Request.UserUpdateRequest;
import com.example.samuel_shop.DTO.Response.UserResponse;

public interface IUserService {
    List<UserResponse> getUsers();
    UserResponse getUser(String userId);
    UserResponse createUser(UserCreateRequest request);
    UserResponse updateUser(String userId, UserUpdateRequest request);
    UserResponse getMyInfor();
    void deleteUser(String id);
}
