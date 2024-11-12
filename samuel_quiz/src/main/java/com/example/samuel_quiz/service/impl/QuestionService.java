package com.example.samuel_quiz.service.impl;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.samuel_quiz.dto.question.request.QuestionCreateRequest;
import com.example.samuel_quiz.dto.question.request.QuestionUpdateRequest;
import com.example.samuel_quiz.dto.question.response.QuestionResponse;
import com.example.samuel_quiz.entities.Answer;
import com.example.samuel_quiz.entities.Question;
import com.example.samuel_quiz.entities.Subject;
import com.example.samuel_quiz.mapper.QuestionMapper;
import com.example.samuel_quiz.repository.AnswerRepository;
import com.example.samuel_quiz.repository.QuestionRepository;
import com.example.samuel_quiz.repository.SubjectRepository;
import com.example.samuel_quiz.service.IQuestionService;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE)
public class QuestionService implements IQuestionService {

    @Autowired
    QuestionRepository questionRepo;

    @Autowired
    SubjectRepository subjectRepo;

    @Autowired
    AnswerRepository answerRepo;

    @Autowired
    QuestionMapper questionMapper;

    @Override
    public List<QuestionResponse> getQuestions() {
        return questionRepo.findAll().stream()
                .map(questionMapper::toQuestionResponse)
                .collect(Collectors.toList());
    }

    @Override
    public QuestionResponse getQuestion(Long questionId) {
        Question question = questionRepo.findById(questionId)
                .orElseThrow(() -> new EntityNotFoundException("Question not found"));
        return questionMapper.toQuestionResponse(question);
    }

    @Override
    @Transactional
    public QuestionResponse createQuestion(QuestionCreateRequest request) {
        // Lấy Subject theo subjectId
        Subject subject = subjectRepo.findById(request.getSubjectId())
                .orElseThrow(() -> new EntityNotFoundException("Subject not found"));

        // Tạo Question từ request và set subject
        Question question = questionMapper.toQuestion(request);
        question.setSubject(subject);

        // Lấy danh sách các Answer theo ID
        Set<Answer> answers = new HashSet<>(answerRepo.findAllById(request.getAnswerIds()));
        question.setAnswers(answers);

        // Lưu Question
        Question savedQuestion = questionRepo.save(question);
        return questionMapper.toQuestionResponse(savedQuestion);
    }

    @Override
    @Transactional
    public QuestionResponse updateQuestion(Long questionId, QuestionUpdateRequest request) {
        Question existingQuestion = questionRepo.findById(questionId)
                .orElseThrow(() -> new EntityNotFoundException("Question not found"));
        questionMapper.updateQuestion(existingQuestion, request);
        Question updatedQuestion = questionRepo.save(existingQuestion);
        return questionMapper.toQuestionResponse(updatedQuestion);
    }

    @Override
    @Transactional
    public void deleteQuestion(Long questionId) {
        if (!questionRepo.existsById(questionId)) {
            throw new EntityNotFoundException("Question not found");
        }
        questionRepo.deleteById(questionId);
    }
}
