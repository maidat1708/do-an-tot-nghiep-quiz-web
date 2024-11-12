package com.example.samuel_quiz.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import com.example.samuel_quiz.dto.profile.request.ProfileCreateRequest;
import com.example.samuel_quiz.dto.profile.request.ProfileUpdateRequest;
import com.example.samuel_quiz.dto.profile.response.ProfileResponse;
import com.example.samuel_quiz.entities.Profile;

@Mapper(componentModel = "spring")
public interface ProfileMapper {

    ProfileResponse toProfileResponse(Profile profile);

    Profile toProfile(ProfileCreateRequest request);

    @Mapping(target = "id", ignore = true) // Không update ID
    void updateProfile(@MappingTarget Profile profile, ProfileUpdateRequest request);
}
