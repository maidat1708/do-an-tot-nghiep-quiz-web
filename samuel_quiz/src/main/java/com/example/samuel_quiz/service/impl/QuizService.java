package com.example.samuel_quiz.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.samuel_quiz.dto.quiz.request.QuizCreateRequest;
import com.example.samuel_quiz.dto.quiz.request.QuizUpdateRequest;
import com.example.samuel_quiz.dto.quiz.response.QuizResponse;
import com.example.samuel_quiz.entities.Quiz;
import com.example.samuel_quiz.entities.Subject;
import com.example.samuel_quiz.mapper.QuizMapper;
import com.example.samuel_quiz.repository.QuizRepository;
import com.example.samuel_quiz.repository.SubjectRepository;
import com.example.samuel_quiz.service.IQuizService;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE)
public class QuizService implements IQuizService {

    @Autowired
    QuizRepository quizRepo;

    @Autowired
    SubjectRepository subjectRepo;

    @Autowired
    QuizMapper quizMapper;

    @Override
    public List<QuizResponse> getQuizzes() {
        return quizRepo.findAll().stream()
                .map(quizMapper::toQuizResponse)
                .collect(Collectors.toList());
    }

    @Override
    public QuizResponse getQuiz(Long quizId) {
        Quiz quiz = quizRepo.findById(quizId)
                .orElseThrow(() -> new EntityNotFoundException("Quiz not found"));
        return quizMapper.toQuizResponse(quiz);
    }

    @Override
    @Transactional
    public QuizResponse createQuiz(QuizCreateRequest request) {
        // Lấy Subject theo subjectId trong request
        Subject subject = subjectRepo.findById(request.getSubjectId())
                .orElseThrow(() -> new EntityNotFoundException("Subject not found with ID: " + request.getSubjectId()));

        // Tạo Quiz từ request và set subject
        Quiz quiz = quizMapper.toQuiz(request);
        quiz.setSubject(subject);

        // Lưu Quiz
        Quiz savedQuiz = quizRepo.save(quiz);
        return quizMapper.toQuizResponse(savedQuiz);
    }

    @Override
    @Transactional
    public QuizResponse updateQuiz(Long quizId, QuizUpdateRequest request) {
        Quiz existingQuiz = quizRepo.findById(quizId)
                .orElseThrow(() -> new EntityNotFoundException("Quiz not found"));
        quizMapper.updateQuiz(existingQuiz, request);
        Quiz updatedQuiz = quizRepo.save(existingQuiz);
        return quizMapper.toQuizResponse(updatedQuiz);
    }

    @Override
    @Transactional
    public void deleteQuiz(Long quizId) {
        if (!quizRepo.existsById(quizId)) {
            throw new EntityNotFoundException("Quiz not found");
        }
        quizRepo.deleteById(quizId);
    }
}
