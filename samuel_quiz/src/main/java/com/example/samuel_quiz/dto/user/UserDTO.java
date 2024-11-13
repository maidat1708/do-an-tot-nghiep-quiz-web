package com.example.samuel_quiz.dto.user;

import com.example.samuel_quiz.dto.profile.ProfileDTO;
import com.example.samuel_quiz.dto.result.ResultDTO;
import com.example.samuel_quiz.entities.Profile;
import com.example.samuel_quiz.entities.Result;
import jakarta.persistence.CascadeType;
import jakarta.persistence.FetchType;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import java.util.Set;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserDTO {
    String id;
    String username;
    String password;
    String roles;
    ProfileDTO profile;
    Set<ResultDTO> results;
}
