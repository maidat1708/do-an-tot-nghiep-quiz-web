package com.example.samuel_shop.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.samuel_shop.Entities.Comment;

public interface CommentRepository extends JpaRepository<Comment, Integer> {
}

