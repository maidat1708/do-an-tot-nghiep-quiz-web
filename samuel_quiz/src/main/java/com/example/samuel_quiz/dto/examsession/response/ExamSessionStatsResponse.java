package com.example.samuel_quiz.dto.examsession.response;

import com.example.samuel_quiz.dto.result.response.ResultResponse;
import com.example.samuel_quiz.dto.result.response.ResultStatusResponse;
import com.example.samuel_quiz.dto.statistics.ResultTrend;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExamSessionStatsResponse {
    private Map<String, Integer> scoreDistribution;
    private Map<String, Integer> detailedScoreDistribution;
    private double averageScore;
    private double medianScore;
    private double highestScore;
    private double lowestScore;
    private int totalStudents;
    private int passedStudents;
    private double passRate;
    private double standardDeviation;
    private Map<String, Integer> gradeDistribution;
    private List<ResultStatusResponse> topResults;
    private List<ResultTrend> scoreTrends;
} 