package com.example.samuel_shop.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.samuel_shop.DTO.Response.APIResponse;
import com.example.samuel_shop.Entities.Comment;
import com.example.samuel_shop.Service.ICommentService;

import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;

import java.util.*;

@RestController
@RequestMapping("/comments")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CommentController {

    @Autowired
    ICommentService commentService;

    @PostMapping
    public APIResponse<Comment> createComment(@RequestBody Comment comment) {
        return APIResponse.<Comment>builder()
                .result(commentService.createComment(comment))
                .build();
    }

    @PutMapping("/{commentId}")
    public APIResponse<Comment> updateComment(@PathVariable int commentId, @RequestBody Comment updatedComment) {
        return APIResponse.<Comment>builder()
                .result(commentService.updateComment(commentId, updatedComment))
                .build();
    }

    @DeleteMapping("/{commentId}")
    public APIResponse<String> deleteComment(@PathVariable int commentId) {
        commentService.deleteComment(commentId);
        return APIResponse.<String>builder()
                .result("Comment has been deleted!")
                .build();
    }

    @GetMapping("/{commentId}")
    public APIResponse<Comment> getCommentById(@PathVariable int commentId) {
        return APIResponse.<Comment>builder()
                .result(commentService.getCommentById(commentId))
                .build();
    }

    @GetMapping
    public APIResponse<List<Comment>> getAllComments() {
        return APIResponse.<List<Comment>>builder()
                .result(commentService.getAllComments())
                .build();
    }
}

