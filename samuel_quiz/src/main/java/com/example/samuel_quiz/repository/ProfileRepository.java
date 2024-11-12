package com.example.samuel_quiz.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.samuel_quiz.entities.Profile;

@Repository
public interface ProfileRepository extends JpaRepository<Profile, Long> {
}