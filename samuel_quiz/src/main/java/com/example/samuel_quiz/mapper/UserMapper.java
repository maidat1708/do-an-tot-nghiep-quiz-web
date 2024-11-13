package com.example.samuel_quiz.mapper;

import com.example.samuel_quiz.dto.profile.ProfileDTO;
import com.example.samuel_quiz.dto.user.UserDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import com.example.samuel_quiz.dto.user.response.UserResponse;
import com.example.samuel_quiz.dto.user.request.UserCreateRequest;
import com.example.samuel_quiz.dto.user.request.UserUpdateRequest;
import com.example.samuel_quiz.entities.User;
import org.mapstruct.Named;

@Mapper(componentModel = "spring") // componentModel = "spring" -> create bean -> DI 
public interface UserMapper extends BaseMapper<User, UserDTO> {
    @Mapping(target = "roles", ignore =  true) // ko map roles 
    @Mapping(target = "id", ignore =  true)
    @Mapping(target = "results", ignore =  true)
    @Mapping(target = "profile", source = "request", qualifiedByName = "mapToProfile") // ánh xạ nested profile
    UserDTO toUser(UserCreateRequest request);

    UserResponse tUserResponse(UserDTO user);

    @Mapping(target = "roles", ignore =  true) // ko map roles 
    @Mapping(target = "id", ignore =  true) 
    void updateUser(@MappingTarget UserDTO user, UserUpdateRequest request);

    @Named("mapToProfile")
    default ProfileDTO mapToProfile(UserCreateRequest request) {
        if (request == null) {
            return null;
        }
        ProfileDTO profile = new ProfileDTO();
        profile.setEmail(request.getEmail());
        profile.setFirstName(request.getFirstName());
        profile.setLastName(request.getLastName());
        return profile;
    }
}
