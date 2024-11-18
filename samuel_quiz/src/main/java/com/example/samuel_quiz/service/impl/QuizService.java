package com.example.samuel_quiz.service.impl;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import com.example.samuel_quiz.dto.question.QuestionDTO;
import com.example.samuel_quiz.dto.quiz.QuizDTO;
import com.example.samuel_quiz.entities.*;
import com.example.samuel_quiz.mapper.AnswerHistoryMapper;
import com.example.samuel_quiz.mapper.QuesionHistoryMapper;
import com.example.samuel_quiz.mapper.SubjectMapper;
import com.example.samuel_quiz.repository.QuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.samuel_quiz.dto.quiz.request.QuizCreateRequest;
import com.example.samuel_quiz.dto.quiz.request.QuizUpdateRequest;
import com.example.samuel_quiz.dto.quiz.response.QuizResponse;
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
    QuestionRepository questionRepo;

    @Autowired
    QuizMapper quizMapper;

    @Autowired
    SubjectMapper subjectMapper;

    @Autowired
    QuesionHistoryMapper quesionHistoryMapper;

    @Autowired
    AnswerHistoryMapper answerHistoryMapper;

    @Override
    public List<QuizResponse> getQuizzes() {
        return quizRepo.findAll().stream()
                .map(quiz -> quizMapper.toQuizResponse(quizMapper.toDto(quiz))) // Ánh xạ từ Quiz Entity -> QuizDTO -> QuizResponse
                .collect(Collectors.toList());
    }

    @Override
    public QuizResponse getQuiz(Long quizId) {
        Quiz quiz = quizRepo.findById(quizId)
                .orElseThrow(() -> new EntityNotFoundException("Quiz not found"));
        QuizDTO quizDTO = quizMapper.toDto(quiz);
        return quizMapper.toQuizResponse(quizDTO);
    }

    @Override
    @Transactional
    public QuizResponse createQuiz(QuizCreateRequest request) {
        // Lấy Subject theo subjectId trong request
        Subject subject = subjectRepo.findById(request.getSubjectId())
                .orElseThrow(() -> new EntityNotFoundException("Subject not found with ID: " + request.getSubjectId()));

        Set<Question> questions = new HashSet<>(questionRepo.findAllById(request.getQuestionIds().stream().toList()));
        Set<QuestionHistory> questionHistories = questions.stream()
                .map(question -> {
                    QuestionHistory questionHistory = quesionHistoryMapper.QuestionConvertToQuestionHistory(question);
                    questionHistory.setAnswerHistories(question.getAnswers()
                            .stream()
                            .map(answer -> {
                                AnswerHistory answerHistory = answerHistoryMapper.AnswerConvertToAnswerHistory(answer);
                                answerHistory.setQuestionHistory(questionHistory);
                                return answerHistory;
                            })
                            .collect(Collectors.toSet()));
                    // Thiết lập mối quan hệ hai chiều
                    return questionHistory;
                })
                .collect(Collectors.toSet());
        // Tạo Quiz từ request và set subject
        QuizDTO quiz = quizMapper.toQuiz(request);
        quiz.setSubject(subjectMapper.toDto(subject));

        Quiz savedQuiz = quizMapper.toEntity(quiz);
        savedQuiz.setQuestionHistories(questionHistories);
        savedQuiz.setStatus(1);
        // Lưu Quiz
        return quizMapper.toQuizResponse(quizMapper.toDto(quizRepo.save(savedQuiz)));
    }

    @Override
    @Transactional
    public QuizResponse updateQuiz(Long quizId, QuizUpdateRequest request) {
        Quiz existingQuiz = quizRepo.findById(quizId)
                .orElseThrow(() -> new EntityNotFoundException("Quiz not found"));

        quizMapper.updateQuiz(quizMapper.toDto(existingQuiz), request);  // Cập nhật từ QuizUpdateRequest -> Quiz Entity
        Quiz updatedQuiz = quizRepo.save(existingQuiz);

        // Trả về QuizResponse sau khi cập nhật
        return quizMapper.toQuizResponse(quizMapper.toDto(updatedQuiz));
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
