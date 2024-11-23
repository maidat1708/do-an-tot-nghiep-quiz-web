package com.example.samuel_quiz.service.impl;

import java.io.IOException;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import com.example.samuel_quiz.dto.question.QuestionDTO;
import com.example.samuel_quiz.dto.quiz.QuizDTO;
import com.example.samuel_quiz.dto.quiz.request.QuizImportRequest;
import com.example.samuel_quiz.dto.quiz.response.QuizResponse;
import com.example.samuel_quiz.dto.result.ResultDTO;
import com.example.samuel_quiz.entities.*;
import com.example.samuel_quiz.mapper.*;
import com.example.samuel_quiz.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.example.samuel_quiz.dto.quiz.request.QuizCreateRequest;
import com.example.samuel_quiz.dto.quiz.request.QuizUpdateRequest;
import com.example.samuel_quiz.dto.quiz.request.QuizSubmissionRequest;
import com.example.samuel_quiz.dto.result.response.ResultResponse;
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
    QuestionHistoryMapper questionHistoryMapper;

    @Autowired
    AnswerHistoryMapper answerHistoryMapper;

    @Autowired
    ExcelService excelService;

    @Autowired
    WordService wordService;

    @Autowired
    PDFService pdfService;

    @Autowired
    UserRepository userRepo;

    @Autowired
    QuestionHistoryRepository questionHistoryRepo;

    @Autowired
    AnswerHistoryRepository answerHistoryRepo;

    @Autowired
    ResultRepository resultRepo;

    @Autowired
    ResultMapper resultMapper;

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
                    QuestionHistory questionHistory = questionHistoryMapper.QuestionConvertToQuestionHistory(question);
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
        Quiz quiz = quizRepo.findById(quizId)
                .orElseThrow(() -> new EntityNotFoundException("Quiz not found"));

        Subject subject = subjectRepo.findById(request.getSubjectId())
                .orElseThrow(() -> new EntityNotFoundException("Subject not found"));

        // Cập nhật thông tin cơ bản
        quiz.setQuizName(request.getQuizName());
        quiz.setDuration(request.getDuration());
        quiz.setTotalQuestion((long) (request.getQuestionIds().size() + request.getQuestionHistoryIds().size()));
        quiz.setSubject(subject);

        Set<QuestionHistory> updatedQuestions = new HashSet<>();

        // Xử lý QuestionHistory có sẵn
        if (request.getQuestionHistoryIds() != null && !request.getQuestionHistoryIds().isEmpty()) {
            Set<QuestionHistory> existingHistories = questionHistoryRepo.findAllById(request.getQuestionHistoryIds())
                    .stream()
                    .collect(Collectors.toSet());
            updatedQuestions.addAll(existingHistories);
        }

        // Xử lý Question mới
        if (request.getQuestionIds() != null && !request.getQuestionIds().isEmpty()) {
            Set<Question> questions = questionRepo.findAllById(request.getQuestionIds())
                    .stream()
                    .collect(Collectors.toSet());

            Set<QuestionHistory> newHistories = questions.stream()
                    .map(question -> {
                        QuestionHistory newHistory = questionHistoryMapper.QuestionConvertToQuestionHistory(question);
                        newHistory.setAnswerHistories(question.getAnswers().stream()
                                .map(answer -> {
                                    AnswerHistory answerHistory = answerHistoryMapper.AnswerConvertToAnswerHistory(answer);
                                    answerHistory.setQuestionHistory(newHistory);
                                    return answerHistory;
                                })
                                .collect(Collectors.toSet()));
                        return questionHistoryRepo.save(newHistory);
                    })
                    .collect(Collectors.toSet());
            
            updatedQuestions.addAll(newHistories);
        }

        // Xóa các câu hỏi không còn trong request
        Set<QuestionHistory> questionsToRemove = quiz.getQuestionHistories().stream()
                .filter(qh -> !request.getQuestionHistoryIds().contains(qh.getId()))
                .collect(Collectors.toSet());

        questionsToRemove.forEach(qh -> {
            answerHistoryRepo.deleteAll(qh.getAnswerHistories());
        });
        questionHistoryRepo.deleteAll(questionsToRemove);

        quiz.setQuestionHistories(updatedQuestions);
        Quiz savedQuiz = quizRepo.save(quiz);

        return quizMapper.toQuizResponse(quizMapper.toDto(savedQuiz));
    }

    @Override
    @Transactional
    public void deleteQuiz(Long quizId) {
        if (!quizRepo.existsById(quizId)) {
            throw new EntityNotFoundException("Quiz not found");
        }
        quizRepo.deleteById(quizId);
    }

    @Override
    @Transactional
    public QuizResponse importQuiz(QuizImportRequest request) {
        // Lấy Subject theo subjectId
        Subject subject = subjectRepo.findById(request.getSubjectId())
                .orElseThrow(() -> new EntityNotFoundException("Subject not found"));

        try {
            // Đọc questions từ file Excel
            List<QuestionDTO> questions = excelService.readQuestionsFromExcel(request.getFile());
            
            // Tạo các Question và Answer entities
            Set<QuestionHistory> questionHistories = questions.stream()
                    .map(questionDTO -> {
                        QuestionHistory questionHistory = new QuestionHistory();
                        questionHistory.setQuestionText(questionDTO.getQuestionText());
                        questionHistory.setLevel(questionDTO.getLevel());
                        questionHistory.setSubject(subject);
                        
                        Set<AnswerHistory> answerHistories = questionDTO.getAnswers().stream()
                                .map(answerDTO -> {
                                    AnswerHistory answerHistory = new AnswerHistory();
                                    answerHistory.setAnswerText(answerDTO.getAnswerText());
                                    answerHistory.setIsCorrect(answerDTO.getIsCorrect());
                                    answerHistory.setQuestionHistory(questionHistory);
                                    return answerHistory;
                                })
                                .collect(Collectors.toSet());
                        
                        questionHistory.setAnswerHistories(answerHistories);
                        return questionHistory;
                    })
                    .collect(Collectors.toSet());

            // Tạo Quiz mới
            Quiz quiz = Quiz.builder()
                    .quizName(request.getQuizName())
                    .duration(request.getDuration())
                    .totalQuestion((long) questions.size())
                    .subject(subject)
                    .questionHistories(questionHistories)
                    .status(1)
                    .build();

            Quiz savedQuiz = quizRepo.save(quiz);
            return quizMapper.toQuizResponse(quizMapper.toDto(savedQuiz));
            
        } catch (IOException e) {
            throw new RuntimeException("Failed to process Excel file", e);
        }
    }

    @Override
    @Transactional
    public QuizResponse importQuizFromWord(QuizImportRequest request) {
        Subject subject = subjectRepo.findById(request.getSubjectId())
                .orElseThrow(() -> new EntityNotFoundException("Subject not found"));

        try {
            List<QuestionDTO> questions = wordService.readQuestionsFromWord(request.getFile());
            
            Set<QuestionHistory> questionHistories = questions.stream()
                    .map(questionDTO -> {
                        QuestionHistory questionHistory = new QuestionHistory();
                        questionHistory.setQuestionText(questionDTO.getQuestionText());
                        questionHistory.setLevel(questionDTO.getLevel());
                        questionHistory.setSubject(subject);
                        
                        Set<AnswerHistory> answerHistories = questionDTO.getAnswers().stream()
                                .map(answerDTO -> {
                                    AnswerHistory answerHistory = new AnswerHistory();
                                    answerHistory.setAnswerText(answerDTO.getAnswerText());
                                    answerHistory.setIsCorrect(answerDTO.getIsCorrect());
                                    answerHistory.setQuestionHistory(questionHistory);
                                    return answerHistory;
                                })
                                .collect(Collectors.toSet());
                        
                        questionHistory.setAnswerHistories(answerHistories);
                        return questionHistory;
                    })
                    .collect(Collectors.toSet());

            Quiz quiz = Quiz.builder()
                    .quizName(request.getQuizName())
                    .duration(request.getDuration())
                    .totalQuestion((long) questions.size())
                    .subject(subject)
                    .questionHistories(questionHistories)
                    .status(1)
                    .build();

            Quiz savedQuiz = quizRepo.save(quiz);
            return quizMapper.toQuizResponse(quizMapper.toDto(savedQuiz));
            
        } catch (IOException e) {
            throw new RuntimeException("Failed to process Word file", e);
        }
    }

    @Override
    @Transactional
    public QuizResponse importQuizFromPDF(QuizImportRequest request) {
        Subject subject = subjectRepo.findById(request.getSubjectId())
                .orElseThrow(() -> new EntityNotFoundException("Subject not found"));

        try {
            List<QuestionDTO> questions = pdfService.readQuestionsFromPDF(request.getFile());
            
            Set<QuestionHistory> questionHistories = questions.stream()
                    .map(questionDTO -> {
                        QuestionHistory questionHistory = new QuestionHistory();
                        questionHistory.setQuestionText(questionDTO.getQuestionText());
                        questionHistory.setLevel(questionDTO.getLevel());
                        questionHistory.setSubject(subject);
                        
                        Set<AnswerHistory> answerHistories = questionDTO.getAnswers().stream()
                                .map(answerDTO -> {
                                    AnswerHistory answerHistory = new AnswerHistory();
                                    answerHistory.setAnswerText(answerDTO.getAnswerText());
                                    answerHistory.setIsCorrect(answerDTO.getIsCorrect());
                                    answerHistory.setQuestionHistory(questionHistory);
                                    return answerHistory;
                                })
                                .collect(Collectors.toSet());
                        
                        questionHistory.setAnswerHistories(answerHistories);
                        return questionHistory;
                    })
                    .collect(Collectors.toSet());

            Quiz quiz = Quiz.builder()
                    .quizName(request.getQuizName())
                    .duration(request.getDuration())
                    .totalQuestion((long) questions.size())
                    .subject(subject)
                    .questionHistories(questionHistories)
                    .status(1)
                    .build();

            Quiz savedQuiz = quizRepo.save(quiz);
            return quizMapper.toQuizResponse(quizMapper.toDto(savedQuiz));
            
        } catch (IOException e) {
            throw new RuntimeException("Failed to process PDF file", e);
        }
    }

    @Override
    @Transactional
    public ResultResponse gradeQuiz(QuizSubmissionRequest request) {
        // Lấy thông tin quiz
        Quiz quiz = quizRepo.findById(request.getQuizId())
                .orElseThrow(() -> new EntityNotFoundException("Quiz not found"));
                
        // Lấy user hiện tại
        String currentUserId = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepo.findByUsername(currentUserId)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));
                
        LocalDateTime timeEnd = LocalDateTime.now();
        
        // Tạo Result
        Result result = Result.builder()
                .user(user)
                .quiz(quiz)
                .timeStart(request.getTimeStart())
                .timeEnd(timeEnd)
                .examDuration(Duration.between(request.getTimeStart(), timeEnd).getSeconds())
                .totalQuestion(quiz.getTotalQuestion())
                .build();
                
        Set<ResultDetail> resultDetails = new HashSet<>();
        long correctAnswers = 0;
        
        // Xử lý từng câu trả lời
        for (QuizSubmissionRequest.QuestionSubmission submission : request.getSubmissions()) {
            QuestionHistory question = questionHistoryRepo.findById(submission.getQuestionId())
                    .orElseThrow(() -> new EntityNotFoundException("Question not found"));
                    
            // Lấy đáp án đã chọn
            Set<AnswerHistory> selectedAnswers = new HashSet<>(answerHistoryRepo.findAllById(submission.getSelectedAnswerIds()));
            
            // Kiểm tra đáp án đúng - sửa lại phần này
            Set<Long> correctAnswerIds = question.getAnswerHistories().stream()
                    .filter(a -> a.getIsCorrect() == 1)  // Lọc các đáp án có isCorrect = 1
                    .map(AnswerHistory::getId)
                    .collect(Collectors.toSet());
                    
            // Kiểm tra xem người dùng đã chọn đúng tất cả đáp án đúng chưa
            Set<Long> userAnswerIds = new HashSet<>(submission.getSelectedAnswerIds());
            int isCorrect = userAnswerIds.equals(correctAnswerIds) ? 1 : 0;
                    
            if (isCorrect == 1) {
                correctAnswers++;
            }
            
            // Tạo ResultDetail với isCorrect kiểu Integer
            ResultDetail detail = ResultDetail.builder()
                    .result(result)
                    .questionHistory(question)
                    .selectedAnswers(selectedAnswers)
                    .isCorrect(isCorrect)  // Đổi thành Integer
                    .build();
                    
            resultDetails.add(detail);
        }
        
        // Cập nhật và lưu Result
        result.setCorrectAnswer(correctAnswers);
        result.setScore((float) correctAnswers / quiz.getTotalQuestion() * 10);
        result.setResultDetails(resultDetails);
        
        Result savedResult = resultRepo.save(result);
        ResultDTO resultDTO = resultMapper.toDto(savedResult);
        
        return resultMapper.toResultResponse(resultDTO);
    }
}
