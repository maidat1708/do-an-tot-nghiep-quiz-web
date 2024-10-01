package com.example.samuel_shop.Service.Impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.samuel_shop.DTO.Request.UserCreateRequest;
import com.example.samuel_shop.DTO.Request.UserUpdateRequest;
import com.example.samuel_shop.DTO.Response.UserResponse;
import com.example.samuel_shop.Entities.User;
import com.example.samuel_shop.Enums.Role;
import com.example.samuel_shop.Exception.AppException;
import com.example.samuel_shop.Exception.ErrorCode;
import com.example.samuel_shop.Mapper.UserMapper;
import com.example.samuel_shop.Repository.UserRepository;
import com.example.samuel_shop.Service.IUserService;

import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;



@Service
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserService implements IUserService {
    @Autowired
    UserRepository userRepo;
    @Autowired
    UserMapper userMapper;
    @Autowired
    PasswordEncoder passwordEncoder;

    @Override
    public List<UserResponse> getUsers() {
        return userRepo.findAll().stream()
                .map(userMapper::tUserResponse).toList();
    }

    @Override
    public UserResponse getUser(String userId) {
        User user = userRepo.findById(userId).orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));
        return userMapper.tUserResponse(user);
    }

    @Override
    public UserResponse getMyInfor() {
        // get token in sercuritycontextholder -> get payload ( infor ) token
        SecurityContext context = SecurityContextHolder.getContext();
        String name = context.getAuthentication().getName();
        // get paylad
        // var authority = context.getAuthentication().getAuthorities().toArray();
        User user = userRepo.findByUsername(name).orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));
        return userMapper.tUserResponse(user);
    }

    @Override
    @Transactional
    public UserResponse createUser(UserCreateRequest request) {
        if (userRepo.existsByUsername(request.getUsername()))
            throw new AppException(ErrorCode.USER_EXISTED);
        User user = userMapper.toUser(request);
        String roles = Role.USER.name();
        user.setRoles(roles);
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userMapper.tUserResponse(userRepo.save(user));
    }

    @Override
    @Transactional
    public UserResponse updateUser(String userId, UserUpdateRequest request) {
        User user = userRepo.findById(userId).orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));
        userMapper.updateUser(user, request);
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        if (request.getRoles() != null) {
            user.setRoles(request.getRoles());
        }
        return userMapper.tUserResponse(userRepo.save(user));
    }

    @Override
    @Transactional
    public void deleteUser(String id) {
        userRepo.deleteById(id);
    }
    // public static Set<String> stringToSet(String str) {
    // if (str != null && !str.isEmpty()) {
    // return new HashSet<>(Arrays.asList(str.split(",")));
    // }
    // return new HashSet<>();
    // }

    // public static String setToString(Set<String> set) {
    // if (set != null && !set.isEmpty()) {
    // return String.join(",", set);
    // }
    // return "";
    // }
}
