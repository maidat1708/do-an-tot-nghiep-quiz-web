package com.example.samuel_quiz.controller;

import java.util.List;

import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.samuel_quiz.dto.profile.request.ProfileCreateRequest;
import com.example.samuel_quiz.dto.profile.request.ProfileUpdateRequest;
import com.example.samuel_quiz.dto.profile.response.ProfileResponse;
import com.example.samuel_quiz.dto.response.APIResponse;
import com.example.samuel_quiz.service.IProfileService;

import io.swagger.v3.oas.annotations.parameters.RequestBody;
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

