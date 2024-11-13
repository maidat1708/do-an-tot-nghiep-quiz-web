package com.example.samuel_quiz.exception;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.example.samuel_quiz.dto.auth.response.APIResponse;

import java.util.Objects;


@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(value = Exception.class)
    ResponseEntity<APIResponse<String>> handlingRuntimeException(Exception exception) {
        APIResponse<String> apiResponse = new APIResponse<>();
        apiResponse.setCode(ErrorCode.UNCATEGORIZED_EXCEPTION.getCode());
        apiResponse.setMessage(exception.getMessage());
        return ResponseEntity.badRequest().body(apiResponse);
    }

    @ExceptionHandler(value = AppException.class)
    ResponseEntity<APIResponse<String>> handlingAppException(AppException exception) {
        ErrorCode errorCode = exception.getErrorCode();
        APIResponse<String> apiResponse = new APIResponse<>();
        apiResponse.setCode(errorCode.getCode());
        apiResponse.setMessage(exception.getMessage());
        return ResponseEntity.badRequest().body(apiResponse);
    }

    @ExceptionHandler(value = MethodArgumentNotValidException.class)
    ResponseEntity<APIResponse<String>> handlingValidationException(MethodArgumentNotValidException exception) {
        @SuppressWarnings("null")
        String message = Objects.requireNonNull(exception.getFieldError()).getDefaultMessage();
        APIResponse<String> apiResponse = new APIResponse<>();
        apiResponse.setCode(999);
        apiResponse.setMessage(message);
        // if (errorCode.compareTo(ErrorCode.USERNAME_TOO_LONG) == 0) {
        //     Object maxLength = exception.getFieldError().getArguments()[1];
        //     apiResponse.setMessage("Field must be at most " + maxLength.toString() + " characters long");
        // }
        return ResponseEntity.badRequest().body(apiResponse);
    }
}
