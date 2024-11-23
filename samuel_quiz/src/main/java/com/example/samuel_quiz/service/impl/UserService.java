package com.example.samuel_quiz.service.impl;

import java.util.List;

import com.example.samuel_quiz.dto.profile.ProfileDTO;
import com.example.samuel_quiz.dto.user.UserDTO;
import com.example.samuel_quiz.entities.Profile;
import com.example.samuel_quiz.mapper.ProfileMapper;
import com.example.samuel_quiz.repository.ProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.samuel_quiz.dto.user.response.UserResponse;
import com.example.samuel_quiz.dto.user.request.UserCreateRequest;
import com.example.samuel_quiz.dto.user.request.UserUpdateRequest;
import com.example.samuel_quiz.entities.User;
import com.example.samuel_quiz.enums.Role;
import com.example.samuel_quiz.exception.AppException;
import com.example.samuel_quiz.exception.ErrorCode;
import com.example.samuel_quiz.mapper.UserMapper;
import com.example.samuel_quiz.repository.UserRepository;
import com.example.samuel_quiz.service.IUserService;

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
    ProfileRepository profileRepo;
    @Autowired
    ProfileMapper profileMapper;
    @Autowired
    PasswordEncoder passwordEncoder;

    @Override
    public List<UserResponse> getUsers() {
        return userRepo.findAll().stream()
                .map(user ->userMapper.tUserResponse(userMapper.toDtoWithProfile(user)))
                .toList();
    }

    @Override
    public UserResponse getUser(String userId) {
        User user = userRepo.findById(userId).orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));
        return userMapper.tUserResponse(userMapper.toDtoWithProfile(user));
    }

    @Override
    public UserResponse getMyInfor() {
        // get token in sercuritycontextholder -> get payload ( infor ) token
        SecurityContext context = SecurityContextHolder.getContext();
        String name = context.getAuthentication().getName();
        // get paylad
        // var authority = context.getAuthentication().getAuthorities().toArray();
        User user = userRepo.findByUsername(name).orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));
        return userMapper.tUserResponse(userMapper.toDto(user));
    }

    @Override
    @Transactional
    public UserResponse createUser(UserCreateRequest request) {
        if (userRepo.existsByUsername(request.getUsername()))
            throw new AppException(ErrorCode.USER_EXISTED);
        UserDTO user = userMapper.toUser(request);
        user.setRole(request.getRole());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        User saveUser = userRepo.save(userMapper.toEntity(user));
        UserDTO savedUser = userMapper.toDto(saveUser);
        ProfileDTO profileDTO = ProfileDTO.builder()
                .email(request.getEmail())
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .build();
        Profile saveProfile = profileMapper.toEntity(profileDTO);
        saveProfile.setUser(saveUser);
        savedUser.setProfile(profileMapper.toDto(profileRepo.save(saveProfile)));
        return userMapper.tUserResponse(savedUser);
    }

    @Override
    @Transactional
    public UserResponse updateUser(String userId, UserUpdateRequest request) {
        User user = userRepo.findById(userId).orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));
        Profile profile = profileRepo.findByUserId(userId)
                        .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND,"Profile not found"));
        profileMapper.toUpdateEntity(profile,request.getProfile());
        profileRepo.save(profile);
        UserDTO userDTO = userMapper.toDto(user);
        userMapper.updateUser(userDTO, request);
        User updateUser = userMapper.toEntity(userDTO);
        updateUser.setProfile(profile);
        return userMapper.tUserResponse(userMapper.toDto(userRepo.save(updateUser)));
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
