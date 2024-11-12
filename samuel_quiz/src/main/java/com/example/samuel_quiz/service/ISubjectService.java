package com.example.samuel_quiz.service;

import java.util.List;

import com.example.samuel_quiz.dto.subject.request.SubjectCreateRequest;
import com.example.samuel_quiz.dto.subject.request.SubjectUpdateRequest;
import com.example.samuel_quiz.dto.subject.response.SubjectResponse;

public interface ISubjectService {
    List<SubjectResponse> getSubjects();

    SubjectResponse getSubject(Long subjectId);

    SubjectResponse createSubject(SubjectCreateRequest request);

    SubjectResponse updateSubject(Long subjectId, SubjectUpdateRequest request);

    void deleteSubject(Long subjectId);

}
