package com.example.samuel_shop.Service;

import java.text.ParseException;

import com.example.samuel_shop.DTO.Request.AuthenticationRequest;
import com.example.samuel_shop.DTO.Request.LogoutRequest;
import com.example.samuel_shop.DTO.Request.RefreshRequest;
import com.example.samuel_shop.DTO.Request.VerifyTokenRequest;
import com.example.samuel_shop.DTO.Response.AuthenticationResponse;
import com.example.samuel_shop.DTO.Response.VerifyTokenResponse;
import com.nimbusds.jose.JOSEException;

public interface IAuthenticationService {
    AuthenticationResponse authenticate(AuthenticationRequest request);
    VerifyTokenResponse verifyToken(VerifyTokenRequest request) throws JOSEException, ParseException;
    void logout(LogoutRequest request);
    AuthenticationResponse refreshToken(RefreshRequest request) throws JOSEException, ParseException;
}
