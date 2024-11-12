package com.example.samuel_quiz.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.samuel_quiz.dto.answer.request.AnswerCreateRequest;
import com.example.samuel_quiz.dto.answer.request.AnswerUpdateRequest;
import com.example.samuel_quiz.dto.answer.response.AnswerResponse;
import com.example.samuel_quiz.entities.Answer;
import com.example.samuel_quiz.entities.Question;
import com.example.samuel_quiz.mapper.AnswerMapper;
import com.example.samuel_quiz.repository.AnswerRepository;
import com.example.samuel_quiz.repository.QuestionRepository;
import com.example.samuel_quiz.service.IAnswerService;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AnswerService implements IAnswerService {

    @Autowired
    AnswerRepository answerRepo;

    @Autowired
    AnswerMapper answerMapper;

    @Autowired
    QuestionRepository questionRepo;

    @Override
    public List<AnswerResponse> getAnswers() {
        return answerRepo.findAll().stream()
                .map(answerMapper::toAnswerResponse)
                .collect(Collectors.toList());
    }

    @Override
    public AnswerResponse getAnswer(Long answerId) {
        Answer answer = answerRepo.findById(answerId)
                .orElseThrow(() -> new EntityNotFoundException("Answer not found"));
        return answerMapper.toAnswerResponse(answer);
    }

    @Override
    @Transactional
    public AnswerResponse createAnswer(AnswerCreateRequest request) {
        Question question = questionRepo.findById(request.getQuestionId())
                .orElseThrow(() -> new EntityNotFoundException("Question not found"));
        Answer answer = answerMapper.toAnswer(request);
        answer.setQuestion(question);
        Answer savedAnswer = answerRepo.save(answer);
        return answerMapper.toAnswerResponse(savedAnswer);
    }

    @Override
    @Transactional
    public AnswerResponse updateAnswer(Long answerId, AnswerUpdateRequest request) {
        Answer existingAnswer = answerRepo.findById(answerId)
                .orElseThrow(() -> new EntityNotFoundException("Answer not found"));
        answerMapper.updateAnswer(existingAnswer, request);
        Answer updatedAnswer = answerRepo.save(existingAnswer);
        return answerMapper.toAnswerResponse(updatedAnswer);
    }

    @Override
    @Transactional
    public void deleteAnswer(Long answerId) {
        if (!answerRepo.existsById(answerId)) {
            throw new EntityNotFoundException("Answer not found");
        }
        answerRepo.deleteById(answerId);
    }
}
