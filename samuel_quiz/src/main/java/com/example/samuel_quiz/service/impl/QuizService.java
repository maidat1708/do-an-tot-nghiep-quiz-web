package com.example.samuel_quiz.service.impl;

import java.io.IOException;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

import com.example.samuel_quiz.dto.answer.AnswerDTO;
import com.example.samuel_quiz.dto.question.QuestionDTO;
import com.example.samuel_quiz.dto.question.QuestionPreviewDTO;
import com.example.samuel_quiz.dto.quiz.QuizDTO;
import com.example.samuel_quiz.dto.quiz.request.QuizImportRequest;
import com.example.samuel_quiz.dto.quiz.response.QuizResponse;
import com.example.samuel_quiz.dto.result.ResultDTO;
import com.example.samuel_quiz.dto.result.response.QuestionResultResponse;
import com.example.samuel_quiz.entities.*;
import com.example.samuel_quiz.exception.AppException;
import com.example.samuel_quiz.exception.ErrorCode;
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
import org.springframework.web.multipart.MultipartFile;

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
    ExamSessionRepository examSessionRepository;

    @Autowired
    ResultMapper resultMapper;

    @Autowired
    DocumentService documentService;

    @Override
    public List<QuizResponse> getQuizzes() {
        return quizRepo.findAll().stream()
                .map(quiz -> {
                        QuizResponse quizResponse = quizMapper.toQuizResponse(quizMapper.toDto(quiz));
                        quizResponse.setSubject(subjectMapper.toDto(quiz.getSubject()));
                        quizResponse.setQuestionHistories(new HashSet<>(questionHistoryMapper.toListDto(quiz.getQuestionHistories().stream().toList())));
                        return quizResponse;
                    }
                ) // Ánh xạ từ Quiz Entity -> QuizDTO -> QuizResponse
                .collect(Collectors.toList());
    }

    @Override
    public QuizResponse getQuiz(Long quizId) {
        Quiz quiz = quizRepo.findById(quizId)
                .orElseThrow(() -> new EntityNotFoundException("Quiz not found"));
        
        // Chuyển QuestionHistories sang List để có thể trộn
        List<QuestionHistory> shuffledQuestions = new ArrayList<>(quiz.getQuestionHistories());
        Collections.shuffle(shuffledQuestions); // Trộn thứ tự câu hỏi
        
        // Trộn thứ tự đáp án cho mỗi câu hỏi và dùng LinkedHashSet để giữ thứ tự
        shuffledQuestions.forEach(question -> {
            List<AnswerHistory> shuffledAnswers = new ArrayList<>(question.getAnswerHistories());
            Collections.shuffle(shuffledAnswers); // Trộn thứ tự đáp án
            question.setAnswerHistories(new LinkedHashSet<>(shuffledAnswers));
        });
        
        QuizDTO quizDTO = quizMapper.toDto(quiz);
        QuizResponse quizResponse = quizMapper.toQuizResponse(quizDTO);
        quizResponse.setSubject(subjectMapper.toDto(quiz.getSubject()));
        quizResponse.setQuestionHistories(new LinkedHashSet<>(questionHistoryMapper.toListDto(shuffledQuestions)));
        
        return quizResponse;
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
        Quiz savedQuiz = quizMapper.toEntity(quiz);
        savedQuiz.setSubject(subject);
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
    public ResultResponse gradeQuiz(QuizSubmissionRequest request) {
        // Lấy thông tin quiz
        Quiz quiz = quizRepo.findById(request.getQuizId())
                .orElseThrow(() -> new EntityNotFoundException("Quiz not found"));

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

        // Tạo map để lưu submission theo questionId
        Map<Long, QuizSubmissionRequest.QuestionSubmission> submissionMap = request.getSubmissions()
                .stream()
                .collect(Collectors.toMap(
                    QuizSubmissionRequest.QuestionSubmission::getQuestionId,
                    submission -> submission
                ));

        // Xử lý tất cả câu hỏi trong quiz
        for (QuestionHistory question : quiz.getQuestionHistories()) {
            QuizSubmissionRequest.QuestionSubmission submission = submissionMap.get(question.getId());
            Set<AnswerHistory> selectedAnswers = new HashSet<>();
            int isCorrect = 0;

            // Lấy tất cả đáp án đúng của câu hỏi
            Set<Long> correctAnswerIds = question.getAnswerHistories().stream()
                    .filter(a -> a.getIsCorrect() == 1)
                    .map(AnswerHistory::getId)
                    .collect(Collectors.toSet());

            // Nếu có submission thì xử lý đáp án đã chọn
            if (submission != null) {
                selectedAnswers = new HashSet<>(answerHistoryRepo.findAllById(submission.getSelectedAnswerIds()));
                Set<Long> userAnswerIds = new HashSet<>(submission.getSelectedAnswerIds());
                isCorrect = userAnswerIds.equals(correctAnswerIds) ? 1 : 0;

                if (isCorrect == 1) {
                    correctAnswers++;
                }
            }

            // Tạo ResultDetail
            ResultDetail detail = ResultDetail.builder()
                    .result(result)
                    .questionHistory(question)
                    .selectedAnswers(selectedAnswers)
                    .isCorrect(isCorrect)
                    .build();
            resultDetails.add(detail);
        }

        // Cập nhật và lưu Result
        result.setCorrectAnswer(correctAnswers);
        
        // Tính điểm và làm tròn theo yêu cầu
        double rawScore = ((double) correctAnswers / quiz.getTotalQuestion() * 10);
        double roundedScore = roundScore(rawScore);
        result.setScore(roundedScore);
        
        result.setResultDetails(resultDetails);
        if(request.getExamSessionId() != null) {
            result.setExamSession(examSessionRepository.findById(request.getExamSessionId()).orElse(null));
        }
        Result savedResult = resultRepo.save(result);

        // Sử dụng mapper để chuyển đổi sang ResultResponse
        ResultDTO resultDTO = resultMapper.toDto(savedResult);
        return resultMapper.toResultResponse(resultDTO);
    }

    @Override
    @Transactional
    public byte[] createWordQuiz(Long quizId, Long templateId) throws IOException {
        Quiz quiz = quizRepo.findById(quizId)
                .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND, "Quiz not found"));
        
        String subjectName = quiz.getSubject().getSubjectName();
        Long duration = quiz.getDuration();
        
        List<QuestionDTO> questions = convertQuizToQuestionDTOs(quiz);
        return documentService.createWordQuiz(templateId, questions, quiz.getQuizName(), duration);
    }

    @Override
    @Transactional
    public byte[] createPDFQuiz(Long quizId, Long templateId) throws IOException {
        Quiz quiz = quizRepo.findById(quizId)
                .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND, "Quiz not found"));
        
        String subjectName = quiz.getSubject().getSubjectName();
        Long duration = quiz.getDuration();
        
        List<QuestionDTO> questions = convertQuizToQuestionDTOs(quiz);
        return documentService.createPDFQuiz(templateId, questions, quiz.getQuizName(), duration);
    }

    @Override
    public byte[] createWordQuiz(Long quizId, Long templateId, String quizName, Long duration) throws IOException {
        Quiz quiz = quizRepo.findById(quizId)
                .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND, "Quiz not found"));
        
        List<QuestionDTO> questions = convertQuizToQuestionDTOs(quiz);
        return documentService.createWordQuiz(templateId, questions, quiz.getQuizName(), duration);
    }

    @Override
    public byte[] createPDFQuiz(Long quizId, Long templateId, String quizName, Long duration) throws IOException {
        Quiz quiz = quizRepo.findById(quizId)
                .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND, "Quiz not found"));
        
        List<QuestionDTO> questions = convertQuizToQuestionDTOs(quiz);
        return documentService.createPDFQuiz(templateId, questions, quizName, duration);
    }

    private List<QuestionDTO> convertQuizToQuestionDTOs(Quiz quiz) {
        return quiz.getQuestionHistories().stream()
                .map(qh -> {
                    QuestionDTO q = new QuestionDTO();
                    q.setQuestionText(qh.getQuestionText());
                    q.setLevel(qh.getLevel());
                    q.setAnswers(qh.getAnswerHistories().stream()
                            .map(ah -> {
                                AnswerDTO a = new AnswerDTO();
                                a.setAnswerText(ah.getAnswerText());
                                a.setIsCorrect(ah.getIsCorrect());
                                return a;
                            }).collect(Collectors.toSet()));
                    return q;
                })
                .collect(Collectors.toList());
    }

    // Thêm phương thức làm tròn điểm
    private double roundScore(double score) {
        double decimal = score - Math.floor(score); // Lấy phần thập phân
        
        if (decimal >= 0.75) {
            return Math.ceil(score); // Làm tròn lên 1
        } else if (decimal >= 0.5) {
            return Math.floor(score) + 0.5; // Làm tròn xuống 0.5
        } else if (decimal > 0.25) {
            return Math.floor(score) + 0.5; // Làm tròn lên 0.5
        } else {
            return Math.floor(score); // Làm tròn xuống 0
        }
    }

    @Override
    public List<QuestionPreviewDTO> previewQuestionsFromFile(MultipartFile file, String fileType) throws IOException {
        List<QuestionPreviewDTO> questions = new ArrayList<>();
        
        switch (fileType.toLowerCase()) {
            case "pdf":
                // Đọc câu hỏi t� PDF và chuyển đổi sang QuestionPreviewDTO
                List<QuestionDTO> pdfQuestions = pdfService.readQuestionsFromPDF(file);
                questions = convertToPreviewQuestions(pdfQuestions);
                break;
                
            case "word":
                // Đọc câu hỏi t� Word và chuyển đổi sang QuestionPreviewDTO
                List<QuestionDTO> wordQuestions = wordService.readQuestionsFromWord(file);
                questions = convertToPreviewQuestions(wordQuestions);
                break;
                
            case "excel":
                // Đọc câu hỏi t� Excel và chuyển đổi sang QuestionPreviewDTO
                List<QuestionDTO> excelQuestions = excelService.readQuestionsFromExcel(file);
                questions = convertToPreviewQuestions(excelQuestions);
                break;
                
            default:
                throw new AppException(ErrorCode.BAD_REQUEST, "Unsupported file type");
        }
        
        return questions;
    }

    private List<QuestionPreviewDTO> convertToPreviewQuestions(List<QuestionDTO> questions) {
        return questions.stream()
            .map(q -> {
                QuestionPreviewDTO previewDTO = QuestionPreviewDTO.builder()
                    .questionText(q.getQuestionText())
                    .level(q.getLevel())
                    .answers(q.getAnswers())
                    .build();
                    
                // Validate câu hỏi
                validatePreviewQuestion(previewDTO);
                
                return previewDTO;
            })
            .collect(Collectors.toList());
    }

    private void validatePreviewQuestion(QuestionPreviewDTO question) {
        // Kiểm tra nội dung câu hỏi
        if (question.getQuestionText() == null || question.getQuestionText().trim().isEmpty()) {
            question.setValid(false);
            question.setErrorMessage("Nội dung câu hỏi không được để trống");
            return;
        }

        // Kiểm tra đáp án
        if (question.getAnswers() == null || question.getAnswers().isEmpty()) {
            question.setValid(false);
            question.setErrorMessage("Câu hỏi phải có ít nhất một đáp án");
            return;
        }

        // Kiểm tra đáp án đúng
        boolean hasCorrectAnswer = question.getAnswers().stream()
                .anyMatch(answer -> answer.getIsCorrect() == 1);
        if (!hasCorrectAnswer) {
            question.setValid(false);
            question.setErrorMessage("Câu hỏi phải có ít nhất một đáp án đúng");
            return;
        }

        // Nếu pass hết các validation
        question.setValid(true);
        question.setErrorMessage(null);
    }

    @Override
    @Transactional
    public QuizResponse importQuizAfterPreview(QuizImportRequest request) {
        List<QuestionPreviewDTO> editedQuestions = request.getQuestions();
        // Validate input
        if (editedQuestions == null || editedQuestions.isEmpty()){
            throw new AppException(ErrorCode.BAD_REQUEST, "No questions toimport");
        }

        Subject subject = subjectRepo.findById(request.getSubjectId())
                .orElseThrow(() -> new EntityNotFoundException("Subject not found"));

        // Tạo các QuestionHistory và AnswerHistory từcâu hỏi đã chỉnh sửa
        Set<QuestionHistory> questionHistories = editedQuestions.stream()
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
                .totalQuestion((long) editedQuestions.size())
                .subject(subject)
                .questionHistories(questionHistories)
                .status(1)
                .build();

        Quiz savedQuiz = quizRepo.save(quiz);
        return quizMapper.toQuizResponse(quizMapper.toDto(savedQuiz));
    }
}
