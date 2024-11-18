package com.example.samuel_quiz.controller;

import java.util.List;

import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.samuel_quiz.dto.profile.request.ProfileCreateRequest;
import com.example.samuel_quiz.dto.profile.request.ProfileUpdateRequest;
import com.example.samuel_quiz.dto.profile.response.ProfileResponse;
import com.example.samuel_quiz.dto.auth.response.APIResponse;
import com.example.samuel_quiz.service.IProfileService;

import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;

@RestController
@RequestMapping("profiles")
@FieldDefaults(level = AccessLevel.PRIVATE)
@Tag(name = "PROFILE", description = "Thông tin ngươời dùng")
public class ProfileController {

    @Autowired
    IProfileService profileService;

    @GetMapping
    public APIResponse<List<ProfileResponse>> getProfiles() {
        return APIResponse.<List<ProfileResponse>>builder()
                .result(profileService.getProfiles())
                .build();
    }

    @GetMapping("/{id}")
    public APIResponse<ProfileResponse> getProfile(@PathVariable Long id) {
        return APIResponse.<ProfileResponse>builder()
                .result(profileService.getProfile(id))
                .build();
    }

    @GetMapping("/{userId}")
    public APIResponse<ProfileResponse> getProfileByUserId(@PathVariable String userId) {
        return APIResponse.<ProfileResponse>builder()
                .result(profileService.getProfileByUserId(userId))
                .build();
    }

    @PostMapping
    public APIResponse<ProfileResponse> createProfile(@RequestBody ProfileCreateRequest request) {
        return APIResponse.<ProfileResponse>builder()
                .result(profileService.createProfile(request))
                .build();
    }

    @PutMapping("/{id}")
    public APIResponse<ProfileResponse> updateProfile(@PathVariable Long id, @RequestBody ProfileUpdateRequest request) {
        return APIResponse.<ProfileResponse>builder()
                .result(profileService.updateProfile(id, request))
                .build();
    }

    @DeleteMapping("/{id}")
    public APIResponse<Void> deleteProfile(@PathVariable Long id) {
        profileService.deleteProfile(id);
        return APIResponse.<Void>builder().build();
    }
}

