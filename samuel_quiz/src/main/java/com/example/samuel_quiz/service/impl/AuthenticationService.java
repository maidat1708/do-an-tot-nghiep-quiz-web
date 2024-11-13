package com.example.samuel_quiz.service.impl;

import java.util.Date;
import java.util.UUID;
import java.text.ParseException;
import java.time.*;
import java.time.temporal.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.samuel_quiz.dto.auth.request.AuthenticationRequest;
import com.example.samuel_quiz.dto.auth.request.LogoutRequest;
import com.example.samuel_quiz.dto.auth.request.RefreshRequest;
import com.example.samuel_quiz.dto.auth.request.VerifyTokenRequest;
import com.example.samuel_quiz.dto.auth.response.AuthenticationResponse;
import com.example.samuel_quiz.dto.auth.response.VerifyTokenResponse;
import com.example.samuel_quiz.entities.InvalidToken;
import com.example.samuel_quiz.entities.User;
import com.example.samuel_quiz.exception.AppException;
import com.example.samuel_quiz.exception.ErrorCode;
import com.example.samuel_quiz.repository.InvalidTokenRepository;
import com.example.samuel_quiz.repository.UserRepository;
import com.example.samuel_quiz.service.IAuthenticationService;
import com.nimbusds.jose.JOSEException;
import com.nimbusds.jose.JWSAlgorithm;
import com.nimbusds.jose.JWSHeader;
import com.nimbusds.jose.JWSObject;
import com.nimbusds.jose.JWSVerifier;
import com.nimbusds.jose.Payload;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;

import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AuthenticationService implements IAuthenticationService {

    @Autowired
    UserRepository userRepo;

    @Autowired
    InvalidTokenRepository invalidTokenRepo;

    @Value("${jwt.signerKey}")
    protected String SIGNER_KEY;

    @Override
    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);
        User user = userRepo.findByUsername(request.getUsername())
                .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));
        boolean authenticated = passwordEncoder.matches(request.getPassword(), user.getPassword());
        if (!authenticated) {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }
        var token = generateToken(user);

        return AuthenticationResponse.builder()
                .token(token)
                .build();
    }

    @Override
    public VerifyTokenResponse verifyToken(VerifyTokenRequest request) throws JOSEException, ParseException {
        String token = request.getToken();
        boolean isValid = true;
        try {
            checkToken(token);
        } catch (AppException e) {
            isValid = false;
        }
        return VerifyTokenResponse.builder()
                .valid(isValid)
                .build();
    }

    @Override
    public void logout(LogoutRequest request) {
        SignedJWT signedJWT;
        try {
            signedJWT = checkToken(request.getToken());
            String jtID = signedJWT.getJWTClaimsSet().getJWTID();
            Date expiryTime = signedJWT.getJWTClaimsSet().getExpirationTime();
            InvalidToken invalidToken = InvalidToken.builder()
                    .id(jtID)
                    .expiryTime(expiryTime)
                    .build();
            invalidTokenRepo.save(invalidToken);
        } catch (JOSEException | ParseException e) {
            throw new AppException(ErrorCode.UNCATEGORIZED_EXCEPTION, e.getMessage());
        }

    }

    private SignedJWT checkToken(String token) throws JOSEException, ParseException {

        JWSVerifier verifier = new MACVerifier(SIGNER_KEY.getBytes());
        SignedJWT signedJWT = SignedJWT.parse(token);

        Date expiryTime = signedJWT.getJWTClaimsSet().getExpirationTime();
        boolean verified = signedJWT.verify(verifier);

        if (!expiryTime.after(new Date()) && verified)
            throw new AppException(ErrorCode.UNAUTHENTICATED, "Token is invalid");

        if (invalidTokenRepo.existsById(signedJWT.getJWTClaimsSet().getJWTID())) {
            throw new AppException(ErrorCode.UNAUTHENTICATED, "Token is invalid");
        }
        return signedJWT;
    }

    @Override
    public AuthenticationResponse refreshToken(RefreshRequest request) throws JOSEException, ParseException {
        SignedJWT signedJWT = checkToken(request.getToken());
        String jtID = signedJWT.getJWTClaimsSet().getJWTID();
        Date expiryTime = signedJWT.getJWTClaimsSet().getExpirationTime();
        InvalidToken invalidToken = InvalidToken.builder()
                .id(jtID)
                .expiryTime(expiryTime)
                .build();
        invalidTokenRepo.save(invalidToken);
        String username = signedJWT.getJWTClaimsSet().getSubject();
        User user = userRepo.findByUsername(username).orElseThrow(() -> new AppException(ErrorCode.UNAUTHENTICATED));

        return AuthenticationResponse.builder()
                .token(generateToken(user))
                .build();
    }

    private String generateToken(User user) {
        JWSHeader header = new JWSHeader(JWSAlgorithm.HS512);
        JWTClaimsSet jwtClaimsSet = new JWTClaimsSet.Builder()
                .subject(user.getUsername())
                .issuer("Samuel")
                .issueTime(new Date())
                .expirationTime(new Date(
                        Instant.now().plus(1, ChronoUnit.HOURS).toEpochMilli()))
                .jwtID(UUID.randomUUID().toString())
                .claim("scope", user.getRoles())
                .build();

        Payload payload = new Payload(jwtClaimsSet.toJSONObject());

        JWSObject jwsObject = new JWSObject(header, payload);

        try {
            jwsObject.sign(new MACSigner(SIGNER_KEY.getBytes()));
            return jwsObject.serialize();
        } catch (JOSEException e) {
            throw new AppException(ErrorCode.UNCATEGORIZED_EXCEPTION, e.getMessage());
        }
    }

}
