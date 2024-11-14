package com.example.samuel_quiz.service.impl;

import java.util.List;

import com.example.samuel_quiz.dto.profile.ProfileDTO;
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
                .map(profile -> profileMapper.toProfileResponse(profileMapper.toDto(profile))).toList();
    }

    @Override
    public ProfileResponse getProfile(Long profileId) {
        Profile profile = profileRepo.findById(profileId)
                .orElseThrow(() -> new EntityNotFoundException("Profile not found"));
        return profileMapper.toProfileResponse(profileMapper.toDto(profile));
    }

    @Override
    @Transactional
    public ProfileResponse createProfile(ProfileCreateRequest request) {
        ProfileDTO profile = profileMapper.toProfile(request);
        Profile savedProfile = profileRepo.save(profileMapper.toEntity(profile));
        return profileMapper.toProfileResponse(profileMapper.toDto(savedProfile));
    }

    @Override
    @Transactional
    public ProfileResponse updateProfile(Long profileId, ProfileUpdateRequest request) {
        Profile existingProfile = profileRepo.findById(profileId)
                .orElseThrow(() -> new EntityNotFoundException("Profile not found"));
        profileMapper.updateProfile(profileMapper.toDto(existingProfile), request);
        Profile updatedProfile = profileRepo.save(existingProfile);
        return profileMapper.toProfileResponse(profileMapper.toDto(updatedProfile));
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

