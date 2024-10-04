package com.example.samuel_quiz.service;

import java.text.ParseException;

import com.example.samuel_quiz.dto.request.AuthenticationRequest;
import com.example.samuel_quiz.dto.request.LogoutRequest;
import com.example.samuel_quiz.dto.request.RefreshRequest;
import com.example.samuel_quiz.dto.request.VerifyTokenRequest;
import com.example.samuel_quiz.dto.response.AuthenticationResponse;
import com.example.samuel_quiz.dto.response.VerifyTokenResponse;
import com.nimbusds.jose.JOSEException;

public interface IAuthenticationService {
    AuthenticationResponse authenticate(AuthenticationRequest request);
    VerifyTokenResponse verifyToken(VerifyTokenRequest request) throws JOSEException, ParseException;
    void logout(LogoutRequest request);
    AuthenticationResponse refreshToken(RefreshRequest request) throws JOSEException, ParseException;
}
