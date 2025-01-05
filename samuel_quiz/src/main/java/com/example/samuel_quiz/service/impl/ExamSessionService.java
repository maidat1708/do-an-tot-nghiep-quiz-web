package com.example.samuel_quiz.service.impl;

import com.example.samuel_quiz.dto.examsession.request.ExamSessionCreateRequest;
import com.example.samuel_quiz.dto.examsession.request.ExamSessionUpdateRequest;
import com.example.samuel_quiz.dto.examsession.response.ExamSessionResponse;
import com.example.samuel_quiz.dto.questionhistory.QuestionHistoryDTO;
import com.example.samuel_quiz.dto.subject.SubjectDTO;
import com.example.samuel_quiz.entities.ExamSession;
import com.example.samuel_quiz.entities.Quiz;
import com.example.samuel_quiz.entities.User;
import com.example.samuel_quiz.enums.Role;
import com.example.samuel_quiz.exception.AppException;
import com.example.samuel_quiz.exception.ErrorCode;
import com.example.samuel_quiz.mapper.ExamSessionMapper;
import com.example.samuel_quiz.mapper.QuestionHistoryMapper;
import com.example.samuel_quiz.mapper.SubjectMapper;
import com.example.samuel_quiz.repository.ExamSessionRepository;
import com.example.samuel_quiz.repository.QuizRepository;
import com.example.samuel_quiz.repository.UserRepository;
import com.example.samuel_quiz.repository.ResultRepository;
import com.example.samuel_quiz.service.IExamSessionService;
import lombok.RequiredArgsConstructor;
import org.apache.kafka.common.errors.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ExamSessionService implements IExamSessionService {
    
    private final ExamSessionRepository examSessionRepository;
    private final UserRepository userRepository;
    private final QuizRepository quizRepository;
    private final ResultRepository resultRepository;
    private final ExamSessionMapper examSessionMapper;
    private final SubjectMapper subjectMapper;
    private final QuestionHistoryMapper questionHistoryMapper;

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