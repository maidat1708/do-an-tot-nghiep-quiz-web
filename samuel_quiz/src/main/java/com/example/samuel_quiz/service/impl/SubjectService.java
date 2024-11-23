package com.example.samuel_quiz.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import com.example.samuel_quiz.dto.subject.SubjectDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.samuel_quiz.dto.subject.request.SubjectCreateRequest;
import com.example.samuel_quiz.dto.subject.request.SubjectUpdateRequest;
import com.example.samuel_quiz.dto.subject.response.SubjectResponse;
import com.example.samuel_quiz.entities.Subject;
import com.example.samuel_quiz.mapper.SubjectMapper;
import com.example.samuel_quiz.repository.SubjectRepository;
import com.example.samuel_quiz.service.ISubjectService;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SubjectService implements ISubjectService {

    @Autowired
    SubjectRepository subjectRepo;

    @Autowired
    SubjectMapper subjectMapper;

    @Override
    public List<SubjectResponse> getSubjects() {
        return  subjectRepo.findAll().stream()
                .map(entity ->  subjectMapper.toSubjectResponse(subjectMapper.toDto(entity)))
                .collect(Collectors.toList());
    }

    @Override
    public SubjectResponse getSubject(Long subjectId) {
        Subject subject = subjectRepo.findById(subjectId)
                .orElseThrow(() -> new EntityNotFoundException("Subject not found"));
        return subjectMapper.toSubjectResponse(subjectMapper.toDto(subject));
    }

    @Override
    @Transactional
    public SubjectResponse createSubject(SubjectCreateRequest request) {
        Subject subject = subjectRepo.save(subjectMapper.toEntity(subjectMapper.toSubject(request)));
        return subjectMapper.toSubjectResponse(subjectMapper.toDto(subject));
    }

    @Override
    @Transactional
    public SubjectResponse updateSubject(Long subjectId, SubjectUpdateRequest request) {
        Subject existingSubject = subjectRepo.findById(subjectId)
                .orElseThrow(() -> new EntityNotFoundException("Subject not found"));
        SubjectDTO subjectDTO =  subjectMapper.toDto(existingSubject);
        subjectMapper.updateSubject(subjectDTO, request);
        Subject updatedSubject = subjectRepo.save(subjectMapper.toEntity(subjectDTO));
        return subjectMapper.toSubjectResponse(subjectMapper.toDto(updatedSubject));
    }

    @Override
    @Transactional
    public void deleteSubject(Long subjectId) {
        if (!subjectRepo.existsById(subjectId)) {
            throw new EntityNotFoundException("Subject not found");
        }
        subjectRepo.deleteById(subjectId);
    }
}
