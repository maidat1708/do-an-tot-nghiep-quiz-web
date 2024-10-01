package com.example.samuel_shop.Service.Impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.example.samuel_shop.Entities.Comment;
import com.example.samuel_shop.Entities.User;
import com.example.samuel_shop.Exception.AppException;
import com.example.samuel_shop.Exception.ErrorCode;
import com.example.samuel_shop.Repository.CommentRepository;
import com.example.samuel_shop.Repository.UserRepository;
import com.example.samuel_shop.Service.ICommentService;

import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;

import java.sql.Timestamp;
import java.util.*;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CommentService implements ICommentService {

    @Autowired
    CommentRepository commentRepository;

    @Autowired
    UserRepository userRepository;

    @Override
    @Transactional
    public Comment createComment(Comment comment) {

        Authentication authentication = getUserAuthentication();

        if (authentication == null || !authentication.isAuthenticated()
                || authentication.getPrincipal() instanceof String) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }
        String name = authentication.getName();

        User user = userRepository.findByUsername(name)
                .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));

        comment.setCreatedAt(new Timestamp(new Date().getTime()));
        comment.setUserId(user.getId());

        return commentRepository.save(comment);
    }

    @Override
    @Transactional
    public Comment updateComment(int commentId, Comment updatedComment) {
        Authentication authentication = getUserAuthentication();
        if (authentication == null || !authentication.isAuthenticated()
                || authentication.getPrincipal() instanceof String) {
            throw new AppException(ErrorCode.UNAUTHORIZED, "You cant edit the comment");
        }
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));

        String name = authentication.getName();

        User userAuthentication = userRepository.findByUsername(name)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!comment.getUserId().equals(userAuthentication.getId())) {
            throw new AppException(ErrorCode.UNAUTHORIZED, "You cant edit the comment!");
        }

        // if updatedComment dont have id field
        updatedComment.setId(commentId);
        // updatedComment.setUserId(userAuthentication.getId());
        updatedComment.setCreatedAt(new Timestamp(new Date().getTime()));

        return commentRepository.save(updatedComment);
    }

    @Override
    @Transactional
    public void deleteComment(int commentId) {
        Authentication authentication = getUserAuthentication();
        if (authentication == null || !authentication.isAuthenticated()
                || authentication.getPrincipal() instanceof String) {
            throw new AppException(ErrorCode.UNAUTHORIZED, "You cant edit the comment");
        }
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));

        String name = authentication.getName();

        User userAuthentication = userRepository.findByUsername(name)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!comment.getUserId().equals(userAuthentication.getId())) {
            throw new AppException(ErrorCode.UNAUTHORIZED, "You cant delete the comment!");
        }

        commentRepository.deleteById(commentId);
    }

    @Override
    public Comment getCommentById(int commentId) {
        return commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));
    }

    @Override
    public List<Comment> getAllComments() {
        return commentRepository.findAll();
    }

    private Authentication getUserAuthentication() {
        // get authentication from token
        SecurityContext context = SecurityContextHolder.getContext();
        return context.getAuthentication();
    }
}
