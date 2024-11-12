package com.example.samuel_quiz.dto.user.request;

import java.time.LocalDate;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserUpdateRequest {
    @NotNull(message = "Username cannot be null")
    @NotEmpty(message = "Username cannot be empty")
    @Size(min = 5, message = "Username must be at least 5 characters long")
    String username;
    @NotNull(message = "Password cannot be null")
    @NotEmpty(message = "Password cannot be empty")
    @Pattern(regexp = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\\W)(?!.* ).{8,}$", 
    message = "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one special character, one digital character")
    String password;
    String firstname;
    String lastname;
    LocalDate dob;
    String roles;
}
