package com.example.samuel_shop.Service;

import java.util.List;

import com.example.samuel_shop.Entities.Comment;

public interface ICommentService {
    Comment createComment(Comment comment);
    Comment updateComment(int commentId, Comment updatedComment);
    void deleteComment(int commentId);
    Comment getCommentById(int commentId);
    List<Comment> getAllComments();
}
