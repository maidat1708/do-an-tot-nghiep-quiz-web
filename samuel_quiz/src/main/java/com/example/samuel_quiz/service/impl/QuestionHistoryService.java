package com.example.samuel_quiz.service.impl;

import com.example.samuel_quiz.dto.questionhistory.response.QuestionHistoryResponse;
import com.example.samuel_quiz.dto.questionhistory.request.QuestionHistoryUpdateRequest;
import com.example.samuel_quiz.entities.AnswerHistory;
import com.example.samuel_quiz.entities.QuestionHistory;
import com.example.samuel_quiz.entities.Subject;
import com.example.samuel_quiz.mapper.QuestionHistoryMapper;
import com.example.samuel_quiz.repository.AnswerHistoryRepository;
import com.example.samuel_quiz.repository.QuestionHistoryRepository;
import com.example.samuel_quiz.repository.SubjectRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class QuestionHistoryService {
    private final QuestionHistoryRepository questionHistoryRepo;
    private final AnswerHistoryRepository answerHistoryRepo;
    private final SubjectRepository subjectRepo;
    private final QuestionHistoryMapper questionHistoryMapper;

    @Transactional
    public QuestionHistoryResponse updateQuestionHistory(Long id, QuestionHistoryUpdateRequest request) {
        QuestionHistory questionHistory = questionHistoryRepo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("QuestionHistory not found"));

        Subject subject = subjectRepo.findById(request.getSubjectId())
                .orElseThrow(() -> new EntityNotFoundException("Subject not found"));

        // Cập nhật thông tin cơ bản
        questionHistory.setQuestionText(request.getQuestionText());
        questionHistory.setLevel(request.getLevel());
        questionHistory.setSubject(subject);

        // Xóa answers cũ
        answerHistoryRepo.deleteAll(questionHistory.getAnswerHistories());

        // Tạo answers mới
        Set<AnswerHistory> newAnswers = request.getAnswers().stream()
                .map(answerDTO -> {
                    AnswerHistory answer = new AnswerHistory();
                    answer.setAnswerText(answerDTO.getAnswerText());
                    answer.setIsCorrect(answerDTO.getIsCorrect());
                    answer.setQuestionHistory(questionHistory);
                    return answer;
                })
                .collect(Collectors.toSet());

        questionHistory.setAnswerHistories(newAnswers);
        
        QuestionHistory saved = questionHistoryRepo.save(questionHistory);
        return questionHistoryMapper.toResponse(saved);
    }
} 