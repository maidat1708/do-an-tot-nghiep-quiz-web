package com.example.samuel_shop.Configuration;

import java.text.ParseException;

import javax.crypto.spec.SecretKeySpec;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.stereotype.Component;

import com.example.samuel_shop.DTO.Request.VerifyTokenRequest;
import com.example.samuel_shop.DTO.Response.VerifyTokenResponse;
import com.example.samuel_shop.Exception.AppException;
import com.example.samuel_shop.Exception.ErrorCode;
import com.example.samuel_shop.Service.Impl.AuthenticationService;
import com.nimbusds.jose.JOSEException;

import java.util.*;

@Component
public class CustomJWTDecoder implements JwtDecoder {

    @Value("${jwt.signerKey}")
    private String SIGNER_KEY;

    @Autowired
    private AuthenticationService service;

    private NimbusJwtDecoder nimbusJwtDecoder = null;

    @Override
    public Jwt decode(String token) {
        // if token expired or user logout -> exception
        try {
            VerifyTokenResponse verifyTokenResponse = service.verifyToken(VerifyTokenRequest.builder()
                    .token(token)
                    .build());
            if(!verifyTokenResponse.isValid()){
                throw new AppException(ErrorCode.UNAUTHENTICATED,"Token invalid!");
            }
        } catch (JOSEException | ParseException | AppException e) {
            throw new AppException(ErrorCode.UNAUTHENTICATED,"Token invalid!");
        }

        if (Objects.isNull(nimbusJwtDecoder)) {
            SecretKeySpec secretKeySpec = new SecretKeySpec(SIGNER_KEY.getBytes(), "HS512");
            nimbusJwtDecoder = NimbusJwtDecoder
                    .withSecretKey(secretKeySpec)
                    .macAlgorithm(MacAlgorithm.HS512)
                    .build();
        }
        return nimbusJwtDecoder.decode(token);
    }

}
