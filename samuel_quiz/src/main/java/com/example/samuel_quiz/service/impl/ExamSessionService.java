package com.example.samuel_quiz.service.impl;

import com.example.samuel_quiz.dto.examsession.request.ExamSessionCreateRequest;
import com.example.samuel_quiz.dto.examsession.request.ExamSessionUpdateRequest;
import com.example.samuel_quiz.dto.examsession.response.ExamSessionResponse;
import com.example.samuel_quiz.dto.examsession.response.ExamSessionStatsResponse;
import com.example.samuel_quiz.dto.questionhistory.QuestionHistoryDTO;
import com.example.samuel_quiz.dto.result.ResultDTO;
import com.example.samuel_quiz.dto.result.response.ResultStatusResponse;
import com.example.samuel_quiz.dto.subject.SubjectDTO;
import com.example.samuel_quiz.entities.ExamSession;
import com.example.samuel_quiz.entities.Quiz;
import com.example.samuel_quiz.entities.Result;
import com.example.samuel_quiz.entities.User;
import com.example.samuel_quiz.enums.Role;
import com.example.samuel_quiz.exception.AppException;
import com.example.samuel_quiz.exception.ErrorCode;
import com.example.samuel_quiz.dto.result.response.ResultResponse;
import com.example.samuel_quiz.dto.statistics.ResultTrend;
import com.example.samuel_quiz.mapper.*;
import com.example.samuel_quiz.repository.ExamSessionRepository;
import com.example.samuel_quiz.repository.QuizRepository;
import com.example.samuel_quiz.repository.UserRepository;
import com.example.samuel_quiz.repository.ResultRepository;
import com.example.samuel_quiz.service.IExamSessionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.kafka.common.errors.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.Collections;
import java.util.Map;
import java.util.LinkedHashMap;
import java.util.Comparator;
import java.util.ArrayList;

@Service
@RequiredArgsConstructor
@Slf4j
public class ExamSessionService implements IExamSessionService {
    
    private final ExamSessionRepository examSessionRepository;
    private final UserRepository userRepository;
    private final QuizRepository quizRepository;
    private final ResultRepository resultRepository;
    private final ExamSessionMapper examSessionMapper;
    private final SubjectMapper subjectMapper;
    private final QuestionHistoryMapper questionHistoryMapper;
    private final ResultMapper resultMapper;
    private final UserMapper userMapper;
    private final ProfileMapper profileMapper;

    private String calculateStatus(LocalDateTime startTime, LocalDateTime endTime) {
        LocalDateTime now = LocalDateTime.now();
        
        if (now.isBefore(startTime)) {
            return "PENDING";
        } else if (now.isAfter(endTime)) {
            return "COMPLETED";
        } else {
            return "ONGOING";
        }
    }

    @Override
    public List<ExamSessionResponse> getExamSessions() {
        List<ExamSession> examSessions = examSessionRepository.findAll();
        
        // Sắp xếp theo startTime giảm dần (gần nhất lên đầu)
        examSessions.sort((a, b) -> b.getStartTime().compareTo(a.getStartTime()));
        
        return examSessions.stream()
                .map(examSession -> {
                    SubjectDTO subjectDTO = subjectMapper.toDto(examSession.getQuiz().getSubject());
                    ExamSessionResponse response = examSessionMapper.toResponse(examSession);
                    response.setStatus(calculateStatus(examSession.getStartTime(), examSession.getEndTime()));
                    response.getQuiz().setSubject(subjectDTO);
                    return response;
                })
                .collect(Collectors.toList());
    }

    @Override
    public ExamSessionResponse getExamSession(Long id) {
        ExamSession examSession = findExamSessionById(id);
        SubjectDTO subjectDTO = subjectMapper.toDto(examSession.getQuiz().getSubject());
        Set<QuestionHistoryDTO> questionHistoryDTOS = examSession.getQuiz().getQuestionHistories().stream().map(questionHistoryMapper::toDto).collect(Collectors.toSet());
        ExamSessionResponse response = examSessionMapper.toResponse(examSession);
        response.setStatus(calculateStatus(examSession.getStartTime(), examSession.getEndTime()));
        response.getQuiz().setQuestionHistories(questionHistoryDTOS);
        response.getQuiz().setSubject(subjectDTO);
        return response;
    }

    @Override
    @Transactional
    public ExamSessionResponse createExamSession(ExamSessionCreateRequest request) {
        validateExamSessionTiming(request.getStartTime(), request.getEndTime());
        
        Quiz quiz = quizRepository.findById(request.getQuizId())
                .orElseThrow(() -> new ResourceNotFoundException("Quiz not found"));

        Set<User> teachers = validateAndGetTeachers(request.getTeacherIds());
        Set<User> students = validateAndGetStudents(request.getStudentIds());
        
        validateTimeConflicts(teachers, students, request.getStartTime(), request.getEndTime());

        ExamSession examSession = ExamSession.builder()
                .name(request.getName())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .quiz(quiz)
                .teachers(teachers)
                .students(students)
                .build();

        return examSessionMapper.toResponse(examSessionRepository.save(examSession));
    }

    @Override
    @Transactional
    public ExamSessionResponse updateExamSession(Long id, ExamSessionUpdateRequest request) {
        ExamSession examSession = findExamSessionById(id);
        
        if (request.getName() != null) {
            examSession.setName(request.getName());
        }
        
        if (request.getStartTime() != null && request.getEndTime() != null) {
            validateExamSessionTiming(request.getStartTime(), request.getEndTime());
            examSession.setStartTime(request.getStartTime());
            examSession.setEndTime(request.getEndTime());
        }
        
        if (request.getQuizId() != null) {
            Quiz quiz = quizRepository.findById(request.getQuizId())
                    .orElseThrow(() -> new ResourceNotFoundException("Quiz not found"));
            examSession.setQuiz(quiz);
        }
        
        if (request.getTeacherIds() != null) {
            Set<User> teachers = validateAndGetTeachers(request.getTeacherIds());
            examSession.setTeachers(teachers);
        }
        
        if (request.getStudentIds() != null) {
            Set<User> students = validateAndGetStudents(request.getStudentIds());
            examSession.setStudents(students);
        }
        
        return examSessionMapper.toResponse(examSessionRepository.save(examSession));
    }

    @Override
    @Transactional
    public void deleteExamSession(Long id) {
        ExamSession examSession = findExamSessionById(id);
        examSessionRepository.delete(examSession);
    }

    @Override
    public List<ExamSessionResponse> getExamSessionsByTeacherId(String teacherId) {
        return examSessionRepository.findByTeacherId(teacherId).stream()
                .map(examSession -> {
                    SubjectDTO subjectDTO = subjectMapper.toDto(examSession.getQuiz().getSubject());
                    ExamSessionResponse response = examSessionMapper.toResponse(examSession);
                    response.setStatus(calculateStatus(examSession.getStartTime(), examSession.getEndTime()));
                    response.getQuiz().setSubject(subjectDTO);
                    return response;
                })
                .sorted((a, b) -> b.getStartTime().compareTo(a.getStartTime()))
                .collect(Collectors.toList());
    }

    @Override
    public List<ExamSessionResponse> getExamSessionsByStudentId(String studentId) {
        List<ExamSession> examSessions = examSessionRepository.findByStudentId(studentId);
        
        return examSessions.stream()
            .map(entity -> {
                ExamSessionResponse response = examSessionMapper.toResponse(entity);
                response.setStatus(calculateStatus(entity.getStartTime(), entity.getEndTime()));
                response.setTeachers(null);
                response.setStudents(null);
                return response;
            })
            .filter(session -> {
                // Kiểm tra trong bảng results
                boolean hasCompleted = resultRepository
                    .existsByUserIdAndExamSessionId(studentId, session.getId());
                boolean hasOngoing = session.getStatus().equals("ONGOING");
                return !hasCompleted && hasOngoing;
            })
            .collect(Collectors.toList());
    }

    @Override
    public ExamSessionStatsResponse getExamSessionStats(Long examSessionId) {
        ExamSession examSession = examSessionRepository.findById(examSessionId)
                .orElseThrow(() -> new ResourceNotFoundException("ExamSession not found"));

        List<Result> results = resultRepository.findByExamSessionId(examSessionId);
        
        if (results.isEmpty()) {
            throw new AppException(ErrorCode.BAD_REQUEST, "No results found for this exam session");
        }

        List<Double> scores = results.stream()
                .map(Result::getScore)
                .collect(Collectors.toList());

        double averageScore = calculateAverage(scores);
        double medianScore = calculateMedian(scores);
        double standardDeviation = calculateStandardDeviation(scores, averageScore);
        
        List<Result> topResults = getTopResults(results, 5); // Lấy top 5 điểm cao nhất
        List<ResultTrend> scoreTrends = calculateScoreTrends(results);

        return ExamSessionStatsResponse.builder()
                .scoreDistribution(calculateScoreDistribution(scores))
                .detailedScoreDistribution(calculateDetailedScoreDistribution(scores))
                .averageScore(roundToTwoDecimals(averageScore))
                .medianScore(roundToTwoDecimals(medianScore))
                .highestScore(Collections.max(scores))
                .lowestScore(Collections.min(scores))
                .totalStudents(scores.size())
                .passedStudents((int) scores.stream().filter(score -> score >= 5.0).count())
                .passRate(roundToTwoDecimals((double) scores.stream().filter(score -> score >= 5.0).count() / scores.size() * 100))
                .standardDeviation(roundToTwoDecimals(standardDeviation))
                .gradeDistribution(calculateGradeDistribution(scores))
                .topResults(topResults.stream().map(entity ->{
                    ResultDTO resultDTO = resultMapper.toDto(entity);
                    ResultStatusResponse resultStatusResponse = resultMapper.toResultStatusResponse(resultDTO);
                    resultStatusResponse.setUser(userMapper.toUserResponse(userMapper.toDto(entity.getUser())));
                    resultStatusResponse.getUser().setProfile(profileMapper.toDto(entity.getUser().getProfile()));
                    return resultStatusResponse;
                }).collect(Collectors.toList()))
                .scoreTrends(scoreTrends)
                .build();
    }

    // Tính điểm trung bình
    private double calculateAverage(List<Double> scores) {
        return scores.stream()
                .mapToDouble(Double::doubleValue)
                .average()
                .orElse(0.0);
    }

    // Tính độ lệch chuẩn
    private double calculateStandardDeviation(List<Double> scores, double mean) {
        double variance = scores.stream()
                .mapToDouble(score -> Math.pow(score - mean, 2))
                .average()
                .orElse(0.0);
        return Math.sqrt(variance);
    }

    // Tính phân bố điểm theo khoảng
    private Map<String, Integer> calculateScoreDistribution(List<Double> scores) {
        Map<String, Integer> distribution = new LinkedHashMap<>();
        distribution.put("0-4", 0);
        distribution.put("4-6", 0);
        distribution.put("6-8", 0);
        distribution.put("8-10", 0);

        scores.forEach(score -> {
            if (score < 4.0) distribution.merge("0-4", 1, Integer::sum);
            else if (score < 6.0) distribution.merge("4-6", 1, Integer::sum);
            else if (score < 8.0) distribution.merge("6-8", 1, Integer::sum);
            else distribution.merge("8-10", 1, Integer::sum);
        });

        return distribution;
    }

    // Tính phân loại học lực
    private Map<String, Integer> calculateGradeDistribution(List<Double> scores) {
        Map<String, Integer> distribution = new LinkedHashMap<>();
        distribution.put("Giỏi", 0);
        distribution.put("Khá", 0);
        distribution.put("TB", 0);
        distribution.put("Yếu", 0);

        scores.forEach(score -> {
            if (score >= 8.0) distribution.merge("Giỏi", 1, Integer::sum);
            else if (score >= 6.5) distribution.merge("Khá", 1, Integer::sum);
            else if (score >= 5.0) distribution.merge("TB", 1, Integer::sum);
            else distribution.merge("Yếu", 1, Integer::sum);
        });

        return distribution;
    }

    // Làm tròn đến 2 chữ số thập phân
    private double roundToTwoDecimals(double value) {
        return Math.round(value * 100.0) / 100.0;
    }

    // Tính điểm trung vị
    private double calculateMedian(List<Double> scores) {
        List<Double> sortedScores = new ArrayList<>(scores);
        Collections.sort(sortedScores);
        int size = sortedScores.size();
        if (size % 2 == 0) {
            return (sortedScores.get(size/2 - 1) + sortedScores.get(size/2)) / 2.0;
        } else {
            return sortedScores.get(size/2);
        }
    }

    // Lấy danh sách top điểm cao
    private List<Result> getTopResults(List<Result> results, int limit) {
        return results.stream()
                .sorted(Comparator.comparing(Result::getScore).reversed())
                .limit(limit)
                .collect(Collectors.toList());
    }

    // Tính xu hướng điểm theo thời gian
    private List<ResultTrend> calculateScoreTrends(List<Result> results) {
        return results.stream()
                .sorted(Comparator.comparing(Result::getTimeEnd))
                .map(result -> ResultTrend.builder()
                        .submitTime(result.getTimeEnd())
                        .score(result.getScore())
                        .build())
                .collect(Collectors.toList());
    }

    // Tính phân phối điểm chi tiết hơn
    private Map<String, Integer> calculateDetailedScoreDistribution(List<Double> scores) {
        Map<String, Integer> distribution = new LinkedHashMap<>();
        distribution.put("0-2", 0);
        distribution.put("2-4", 0);
        distribution.put("4-6", 0);
        distribution.put("6-7", 0);
        distribution.put("7-8", 0);
        distribution.put("8-9", 0);
        distribution.put("9-10", 0);

        scores.forEach(score -> {
            if (score < 2.0) distribution.merge("0-2", 1, Integer::sum);
            else if (score < 4.0) distribution.merge("2-4", 1, Integer::sum);
            else if (score < 6.0) distribution.merge("4-6", 1, Integer::sum);
            else if (score < 7.0) distribution.merge("6-7", 1, Integer::sum);
            else if (score < 8.0) distribution.merge("7-8", 1, Integer::sum);
            else if (score < 9.0) distribution.merge("8-9", 1, Integer::sum);
            else distribution.merge("9-10", 1, Integer::sum);
        });

        return distribution;
    }

    private ExamSession findExamSessionById(Long id) {
        return examSessionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Exam session not found"));
    }

    private void validateExamSessionTiming(LocalDateTime startTime, LocalDateTime endTime) {
        if (startTime.isAfter(endTime)) {
            throw new AppException(ErrorCode.BAD_REQUEST, "Start time must be before end time");
        }
        
        if (startTime.isBefore(LocalDateTime.now())) {
            throw new AppException(ErrorCode.BAD_REQUEST, "Start time cannot be in the past");
        }
    }

    private Set<User> validateAndGetTeachers(Set<String> teacherIds) {
        Set<User> teachers = teacherIds.stream()
                .map(id -> userRepository.findById(id)
                        .orElseThrow(() -> new ResourceNotFoundException("Teacher not found")))
                .filter(user -> user.getRole().equals(Role.TEACHER.name()))
                .collect(Collectors.toSet());

        if (teachers.isEmpty()) {
            throw new AppException(ErrorCode.BAD_REQUEST, "At least one valid teacher is required");
        }

        return teachers;
    }

    private Set<User> validateAndGetStudents(Set<String> studentIds) {
        Set<User> students = studentIds.stream()
                .map(id -> userRepository.findById(id)
                        .orElseThrow(() -> new ResourceNotFoundException("Student not found")))
                .filter(user -> user.getRole().equals(Role.STUDENT.name()))
                .collect(Collectors.toSet());

        if (students.isEmpty()) {
            throw new AppException(ErrorCode.BAD_REQUEST, "At least one valid student is required");
        }

        return students;
    }

    private void validateTimeConflicts(Set<User> teachers, Set<User> students, 
                                     LocalDateTime startTime, LocalDateTime endTime) {
        // Kiểm tra xung đột thời gian cho giáo viên
        for (User teacher : teachers) {
            if (teacher.hasTimeConflict(startTime, endTime)) {
                throw new AppException(ErrorCode.BAD_REQUEST, 
                    "Teacher " + teacher.getUsername() + " has a time conflict");
            }
        }

        // Kiểm tra xung đột thời gian cho học sinh
        for (User student : students) {
            if (student.hasTimeConflict(startTime, endTime)) {
                throw new AppException(ErrorCode.BAD_REQUEST, 
                    "Student " + student.getUsername() + " has a time conflict");
            }
        }
    }
} 