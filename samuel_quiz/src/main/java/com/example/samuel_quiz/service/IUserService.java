package com.example.samuel_quiz.service;

import java.util.List;

import com.example.samuel_quiz.dto.response.UserResponse;
import com.example.samuel_quiz.dto.user.request.UserCreateRequest;
import com.example.samuel_quiz.dto.user.request.UserUpdateRequest;


public interface IUserService {
    List<UserResponse> getUsers();
    UserResponse getUser(String userId);
    UserResponse createUser(UserCreateRequest request);
    UserResponse updateUser(String userId, UserUpdateRequest request);
    UserResponse getMyInfor();
    void deleteUser(String id);
}
