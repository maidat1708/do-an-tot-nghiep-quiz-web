package com.example.samuel_quiz.controller;

import java.text.ParseException;

import com.example.samuel_quiz.dto.user.request.UserCreateRequest;
import com.example.samuel_quiz.dto.user.response.UserResponse;
import com.example.samuel_quiz.service.IUserService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.samuel_quiz.dto.auth.request.AuthenticationRequest;
import com.example.samuel_quiz.dto.auth.request.LogoutRequest;
import com.example.samuel_quiz.dto.auth.request.RefreshRequest;
import com.example.samuel_quiz.dto.auth.request.VerifyTokenRequest;
import com.example.samuel_quiz.dto.auth.response.APIResponse;
import com.example.samuel_quiz.dto.auth.response.AuthenticationResponse;
import com.example.samuel_quiz.dto.auth.response.VerifyTokenResponse;
import com.example.samuel_quiz.service.IAuthenticationService;
import com.nimbusds.jose.JOSEException;

import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;

@RestController
@RequestMapping("auth")
@FieldDefaults(level = AccessLevel.PRIVATE)
@Tag(name = "AUTHENTICATION", description = "Xác thực")
public class AuthenticationController {

    @Autowired
    IAuthenticationService service;

    @Autowired
    IUserService userService;

    @PostMapping("/login")
    APIResponse<AuthenticationResponse> authenticate(@RequestBody AuthenticationRequest request) {
        return APIResponse.<AuthenticationResponse>builder()
                .result(service.authenticate(request))
                .build();
    }

    @PostMapping("/verify")
    APIResponse<VerifyTokenResponse> verifyToken(@RequestBody VerifyTokenRequest request) throws JOSEException, ParseException {
        return APIResponse.<VerifyTokenResponse>builder()
                .result(service.verifyToken(request))
                .build();
    }

    @PostMapping("/refresh")
    APIResponse<AuthenticationResponse> refreshToken(@RequestBody RefreshRequest request) throws JOSEException, ParseException {
        return APIResponse.<AuthenticationResponse>builder()
                .result(service.refreshToken(request))
                .build();
    }

    @PostMapping("/logout")
    APIResponse<String> logout(@RequestBody LogoutRequest request) {
        service.logout(request);
        return APIResponse.<String>builder()
                .result("Logout successfull!")
                .build();
    }

    @PostMapping("/register")
    APIResponse<UserResponse> createUser(@RequestBody @Valid UserCreateRequest request) {
        return APIResponse.<UserResponse>builder()
                .result(userService.createUser(request))
                .build();
    }


}
