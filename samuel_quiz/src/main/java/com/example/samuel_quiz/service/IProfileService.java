package com.example.samuel_quiz.service;

import java.util.List;

import com.example.samuel_quiz.dto.profile.ProfileDTO;
import com.example.samuel_quiz.dto.profile.request.ProfileCreateRequest;
import com.example.samuel_quiz.dto.profile.request.ProfileUpdateRequest;
import com.example.samuel_quiz.dto.profile.response.ProfileResponse;

public interface IProfileService {
    List<ProfileResponse> getProfiles();
    ProfileResponse getProfile(Long profileId);
    ProfileResponse getProfileByUserId(String userId);
    ProfileResponse createProfile(ProfileCreateRequest request);
    ProfileResponse updateProfile(Long profileId, ProfileUpdateRequest request);
    ProfileDTO updateProfileDTO(String userId, ProfileDTO request);
    void deleteProfile(Long profileId);
}
