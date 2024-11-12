package com.example.samuel_quiz.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.samuel_quiz.dto.profile.request.ProfileCreateRequest;
import com.example.samuel_quiz.dto.profile.request.ProfileUpdateRequest;
import com.example.samuel_quiz.dto.profile.response.ProfileResponse;
import com.example.samuel_quiz.entities.Profile;
import com.example.samuel_quiz.mapper.ProfileMapper;
import com.example.samuel_quiz.repository.ProfileRepository;
import com.example.samuel_quiz.service.IProfileService;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProfileService implements IProfileService {

    @Autowired
    ProfileRepository profileRepo;

    @Autowired
    ProfileMapper profileMapper;

    @Override
    public List<ProfileResponse> getProfiles() {
        return profileRepo.findAll().stream()
                .map(profileMapper::toProfileResponse).toList();
    }

    @Override
    public ProfileResponse getProfile(Long profileId) {
        Profile profile = profileRepo.findById(profileId)
                .orElseThrow(() -> new EntityNotFoundException("Profile not found"));
        return profileMapper.toProfileResponse(profile);
    }

    @Override
    @Transactional
    public ProfileResponse createProfile(ProfileCreateRequest request) {
        Profile profile = profileMapper.toProfile(request);
        Profile savedProfile = profileRepo.save(profile);
        return profileMapper.toProfileResponse(savedProfile);
    }

    @Override
    @Transactional
    public ProfileResponse updateProfile(Long profileId, ProfileUpdateRequest request) {
        Profile existingProfile = profileRepo.findById(profileId)
                .orElseThrow(() -> new EntityNotFoundException("Profile not found"));
        profileMapper.updateProfile(existingProfile, request);
        Profile updatedProfile = profileRepo.save(existingProfile);
        return profileMapper.toProfileResponse(updatedProfile);
    }

    @Override
    @Transactional
    public void deleteProfile(Long profileId) {
        if (!profileRepo.existsById(profileId)) {
            throw new EntityNotFoundException("Profile not found");
        }
        profileRepo.deleteById(profileId);
    }
}

