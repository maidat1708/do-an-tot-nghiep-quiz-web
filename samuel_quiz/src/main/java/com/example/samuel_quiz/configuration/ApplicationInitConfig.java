//TODO: đạt tên package không đúng chuẩn
package com.example.samuel_quiz.configuration;

import com.example.samuel_quiz.entities.Profile;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.example.samuel_quiz.entities.User;
import com.example.samuel_quiz.enums.Role;
import com.example.samuel_quiz.repository.UserRepository;

@Configuration
@FieldDefaults(level = AccessLevel.PRIVATE)
@Slf4j
public class ApplicationInitConfig {

    @Autowired
    PasswordEncoder passwordEncoder;

    @Bean
    ApplicationRunner applicationRunner(UserRepository userRepository){
        return args -> {
            if (userRepository.findByUsername("admin").isEmpty()){
                String roles = Role.ADMIN.name();
                User user = User.builder()
                        .username("admin")
                        .password(passwordEncoder.encode("admin"))
                        .role(roles)
                        .build();
                Profile profile = Profile.builder()
                            .email("admin@gmail.com")
                            .firstName("Samuel")
                            .lastName("Dennis")
                            .user(user)
                            .build();
                user.setProfile(profile);
                userRepository.save(user);
                log.warn("admin user has been created with default password: admin, please change it");
                log.info(user.getRole());
            }
        };
    }
}