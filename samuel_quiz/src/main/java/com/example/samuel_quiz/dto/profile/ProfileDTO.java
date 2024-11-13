package com.example.samuel_quiz.dto.profile;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProfileDTO {
    Long id;
    String email;
    String firstName;
    String lastName;
    String phoneNumber;
    String address;
    LocalDate birthDay;
    Integer gender;
}
