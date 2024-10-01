package com.example.samuel_shop.Controller;

import java.text.ParseException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.samuel_shop.DTO.Request.AuthenticationRequest;
import com.example.samuel_shop.DTO.Request.LogoutRequest;
import com.example.samuel_shop.DTO.Request.RefreshRequest;
import com.example.samuel_shop.DTO.Request.VerifyTokenRequest;
import com.example.samuel_shop.DTO.Response.APIResponse;
import com.example.samuel_shop.DTO.Response.AuthenticationResponse;
import com.example.samuel_shop.DTO.Response.VerifyTokenResponse;
import com.example.samuel_shop.Service.IAuthenticationService;
import com.nimbusds.jose.JOSEException;

import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;

@RestController
@RequestMapping("auth")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AuthenticationController {

    @Autowired
    IAuthenticationService service;

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


}
