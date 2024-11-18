package com.example.samuel_quiz.service.impl;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import com.example.samuel_quiz.dto.question.QuestionDTO;
import com.example.samuel_quiz.exception.AppException;
import com.example.samuel_quiz.exception.ErrorCode;
import com.example.samuel_quiz.mapper.AnswerMapper;
import com.example.samuel_quiz.mapper.SubjectMapper;
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

    @Autowired
    AnswerMapper answerMapper;

    @Autowired
    SubjectMapper subjectMapper;

    @Override
    public List<QuestionResponse> getQuestions() {
        return questionRepo.findAll().stream()
                .map(question -> questionMapper.toQuestionResponse(questionMapper.toDto(question)))
                .collect(Collectors.toList());
    }

    @Override
    public QuestionResponse getQuestion(Long questionId) {
        Question question = questionRepo.findById(questionId)
                .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND, "Question not found"));
        return questionMapper.toQuestionResponse(questionMapper.toDto(question));
    }

    @Override
    @Transactional
    public QuestionResponse createQuestion(QuestionCreateRequest request) {
        // Lấy Subject theo subjectId
        Subject subject = subjectRepo.findById(request.getSubjectId())
                .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND, "Subject not found"));

        // Tạo Question từ request và set subject
        QuestionDTO question = questionMapper.toQuestion(request);
        Question createQuestion = questionMapper.toEntity(question);
        createQuestion.setSubject(subject);
        // Lấy danh sách các Answer theo ID
        Set<Answer> answers = request.getAnswers()
                .stream()
                .map(dto -> {
                    Answer answer = answerMapper.toEntity(dto);
                    answer.setQuestion(createQuestion);
                    return answer;
                })
                .collect(Collectors.toSet());
        createQuestion.setAnswers(answers);
        // Lưu Question
        return questionMapper.toQuestionResponse(questionMapper.toDto(questionRepo.save(createQuestion)));
    }

    @Override
    @Transactional
    public QuestionResponse updateQuestion(Long questionId, QuestionUpdateRequest request) {
        Question existingQuestion = questionRepo.findById(questionId)
                .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND, "Question not found"));

        Subject subject = subjectRepo.findById(request.getSubjectId())
                .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND, "Subject not found"));
        // Cập nhật question hiện tại
        QuestionDTO existingQuestionDTO = questionMapper.toDto(existingQuestion);
        questionMapper.updateQuestion(existingQuestionDTO, request);

        Question updateQuestion = questionMapper.toEntity(existingQuestionDTO);
        updateQuestion.setSubject(subject);
        updateQuestion.getAnswers().forEach(answer -> {
            answer.setQuestion(updateQuestion);
        });

        return questionMapper.toQuestionResponse(questionMapper.toDto( questionRepo.save(updateQuestion)));
    }

    @Override
    @Transactional
    public void deleteQuestion(Long questionId) {
        if (!questionRepo.existsById(questionId)) {
            throw new AppException(ErrorCode.NOT_FOUND, "Question not found");
        }
        questionRepo.deleteById(questionId);
    }
}
