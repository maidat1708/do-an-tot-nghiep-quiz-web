package com.example.samuel_quiz.service.impl;

import com.example.samuel_quiz.dto.result.ResultDTO;
import com.example.samuel_quiz.dto.result.request.ResultCreateRequest;
import com.example.samuel_quiz.dto.result.request.ResultUpdateRequest;
import com.example.samuel_quiz.dto.result.response.ResultExamSessionResponse;
import com.example.samuel_quiz.dto.result.response.ResultResponse;
import com.example.samuel_quiz.entities.Result;
import com.example.samuel_quiz.entities.User;
import com.example.samuel_quiz.entities.Quiz;
import com.example.samuel_quiz.mapper.ProfileMapper;
import com.example.samuel_quiz.mapper.QuizMapper;
import com.example.samuel_quiz.mapper.ResultMapper;
import com.example.samuel_quiz.mapper.UserMapper;
import com.example.samuel_quiz.repository.ResultRepository;
import com.example.samuel_quiz.repository.UserRepository;
import com.example.samuel_quiz.repository.QuizRepository;
import com.example.samuel_quiz.service.IResultService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ResultService implements IResultService {

    @Autowired
    ResultRepository resultRepo;

    @Autowired
    ResultMapper resultMapper;

    @Autowired
    UserMapper userMapper;

    @Autowired
    QuizMapper quizMapper;

    @Autowired
    UserRepository userRepo;

    @Autowired
    QuizRepository quizRepo;

    @Autowired
    ProfileMapper profileMapper;

    @Override
    public List<ResultResponse> getResults() {
        return resultRepo.findAll().stream()
                .map(entity ->{
                    ResultDTO resultDTO = resultMapper.toDto(entity);
                    ResultResponse response = resultMapper.toResultResponse(resultDTO);
                    response.setSubjectId(entity.getQuiz().getSubject().getId());
                    return response;
                })
                .collect(Collectors.toList());
    }

    @Override
    public ResultResponse getResult(Long resultId) {
        Result result = resultRepo.findById(resultId)
                .orElseThrow(() -> new EntityNotFoundException("Result not found"));
        return resultMapper.toResultResponse(resultMapper.toDto(result));
    }

    @Override
    @Transactional
    public ResultResponse createResult(ResultCreateRequest request) {
        ResultDTO resultDTO = resultMapper.toDtoCreateRequest(request);

        User user = userRepo.findById(request.getUserId())
                .orElseThrow(() -> new EntityNotFoundException("User not found with ID: " + request.getUserId()));
        Quiz quiz = quizRepo.findById(request.getQuizId())
                .orElseThrow(() -> new EntityNotFoundException("Quiz not found with ID: " + request.getQuizId()));

        resultDTO.setUser(userMapper.toDto(user));
        resultDTO.setQuiz(quizMapper.toDto(quiz));

        Result result = resultMapper.toEntity(resultDTO);
        Result savedResult = resultRepo.save(result);

        return resultMapper.toResultResponse(resultMapper.toDto(savedResult));
    }

    @Override
    @Transactional
    public ResultResponse updateResult(Long resultId, ResultUpdateRequest request) {
        Result existingResult = resultRepo.findById(resultId)
                .orElseThrow(() -> new EntityNotFoundException("Result not found"));
        resultMapper.updateResultDTO(resultMapper.toDto(existingResult), request);

        Result updatedResult = resultRepo.save(existingResult);
        return resultMapper.toResultResponse(resultMapper.toDto(updatedResult));
    }

    @Override
    @Transactional
    public void deleteResult(Long resultId) {
        if (!resultRepo.existsById(resultId)) {
            throw new EntityNotFoundException("Result not found");
        }
        resultRepo.deleteById(resultId);
    }

    @Override
    public List<ResultResponse> getResultsByUserId(String userId) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));
        
        List<Result> results = resultRepo.findByUserOrderByTimeEndDesc(user);
        
        return results.stream()
                .map(entity ->{
                    ResultDTO resultDTO = resultMapper.toDto(entity);
                    ResultResponse response = resultMapper.toResultResponse(resultDTO);
                    response.setSubjectId(entity.getQuiz().getSubject().getId());
                    return response;
                })
                .collect(Collectors.toList());
    }

    @Override
    public List<ResultExamSessionResponse> getResultsByExamSession(Long examSessionId) {
        List<Result> results = resultRepo.findByExamSessionId(examSessionId);
        return results.stream()
                .map(entity ->{
                    ResultDTO resultDTO = resultMapper.toDto(entity);
                    ResultExamSessionResponse response = resultMapper.toResultExamSessionResponse(resultDTO);
                    response.setSubjectId(entity.getQuiz().getSubject().getId());
                    response.setUser(userMapper.toUserResponse(userMapper.toDto(entity.getUser())));
                    return response;
                })
                .collect(Collectors.toList());
    }
}
