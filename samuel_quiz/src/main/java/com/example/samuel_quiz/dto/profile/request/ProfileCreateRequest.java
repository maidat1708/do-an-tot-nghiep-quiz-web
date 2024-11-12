package com.example.samuel_quiz.dto.profile.request;

import java.time.LocalDate;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProfileCreateRequest {
    String email;
    String firstName;
    String lastName;
    String phoneNumber;
    String address;
    LocalDate birthDay;
    Integer gender;
}
