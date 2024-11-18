package com.example.samuel_quiz.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.experimental.FieldDefaults;

@Getter
@FieldDefaults(level = AccessLevel.PRIVATE)
public enum ErrorCode {
    UNCATEGORIZED_EXCEPTION(1000,"Uncaegorized Exception!",HttpStatus.INTERNAL_SERVER_ERROR),
    USER_EXISTED(1001,"User existed!", HttpStatus.BAD_REQUEST),
    UNAUTHENTICATED(1002,"Username or password is incorrect!", HttpStatus.BAD_REQUEST),
    UNAUTHORIZED(1002,"Invalid JWT token",HttpStatus.FORBIDDEN),
    NOACCESS(1003, "Not Access",HttpStatus.FORBIDDEN),
    BAD_REQUEST(400,"Bad Request",HttpStatus.BAD_REQUEST),
    NOT_FOUND(404, "Not Found", HttpStatus.NOT_FOUND);


    ErrorCode(int code, String message, HttpStatusCode statusCode) {
        this.code = code;
        this.message = message;
        this.statusCode = statusCode;
    }

    int code;
    String message;
    HttpStatusCode statusCode;
}
