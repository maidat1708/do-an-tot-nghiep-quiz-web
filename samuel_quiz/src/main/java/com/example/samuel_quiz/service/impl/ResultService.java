package com.example.samuel_quiz.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.samuel_quiz.dto.result.request.ResultCreateRequest;
import com.example.samuel_quiz.dto.result.request.ResultUpdateRequest;
import com.example.samuel_quiz.dto.result.response.ResultResponse;
import com.example.samuel_quiz.entities.Quiz;
import com.example.samuel_quiz.entities.Result;
import com.example.samuel_quiz.entities.User;
import com.example.samuel_quiz.mapper.ResultMapper;
import com.example.samuel_quiz.repository.QuizRepository;
import com.example.samuel_quiz.repository.ResultRepository;
import com.example.samuel_quiz.repository.UserRepository;
import com.example.samuel_quiz.service.IResultService;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ResultService implements IResultService {

    @Autowired
    ResultRepository resultRepo;

    @Autowired
    UserRepository userRepo;

    @Autowired
    QuizRepository quizRepo;

    @Autowired
    ResultMapper resultMapper;

    @Override
    public List<ResultResponse> getResults() {
        return resultRepo.findAll().stream()
                .map(resultMapper::toResultResponse)
                .collect(Collectors.toList());
    }

    @Override
    public ResultResponse getResult(Long resultId) {
        Result result = resultRepo.findById(resultId)
                .orElseThrow(() -> new EntityNotFoundException("Result not found"));
        return resultMapper.toResultResponse(result);
    }

    @Override
    @Transactional
    public ResultResponse createResult(ResultCreateRequest request) {
        // Lấy User theo userId trong request
        User user = userRepo.findById(request.getUserId())
                .orElseThrow(() -> new EntityNotFoundException("User not found with ID: " + request.getUserId()));

        // Lấy Quiz theo quizId trong request
        Quiz quiz = quizRepo.findById(request.getQuizId())
                .orElseThrow(() -> new EntityNotFoundException("Quiz not found with ID: " + request.getQuizId()));

        // Tạo Result từ request và set user, quiz
        Result result = resultMapper.toResult(request);
        result.setUser(user);
        result.setQuiz(quiz);

        // Lưu Result
        Result savedResult = resultRepo.save(result);
        return resultMapper.toResultResponse(savedResult);
    }

    @Override
    @Transactional
    public ResultResponse updateResult(Long resultId, ResultUpdateRequest request) {
        Result existingResult = resultRepo.findById(resultId)
                .orElseThrow(() -> new EntityNotFoundException("Result not found"));
        resultMapper.updateResult(existingResult, request);
        Result updatedResult = resultRepo.save(existingResult);
        return resultMapper.toResultResponse(updatedResult);
    }

    @Override
    @Transactional
    public void deleteResult(Long resultId) {
        if (!resultRepo.existsById(resultId)) {
            throw new EntityNotFoundException("Result not found");
        }
        resultRepo.deleteById(resultId);
    }
}
