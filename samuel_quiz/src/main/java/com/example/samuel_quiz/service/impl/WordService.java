package com.example.samuel_quiz.service.impl;

import com.example.samuel_quiz.dto.answer.AnswerDTO;
import com.example.samuel_quiz.dto.question.QuestionDTO;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.apache.poi.xwpf.usermodel.*;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE)
public class WordService {
    
    public List<QuestionDTO> readQuestionsFromWord(MultipartFile file) throws IOException {
        List<QuestionDTO> questions = new ArrayList<>();
        
        try (XWPFDocument document = new XWPFDocument(file.getInputStream())) {
            QuestionDTO currentQuestion = null;
            Set<AnswerDTO> currentAnswers = null;
            
            for (XWPFParagraph paragraph : document.getParagraphs()) {
                String text = paragraph.getText().trim();
                if (text.isEmpty()) continue;
                
                // Kiểm tra nếu là câu hỏi mới (bắt đầu bằng số và dấu chấm)
                if (text.matches("^\\d+\\..*")) {
                    // Lưu câu hỏi trước đó nếu có
                    if (currentQuestion != null) {
                        currentQuestion.setAnswers(currentAnswers);
                        questions.add(currentQuestion);
                    }
                    
                    // Tạo câu hỏi mới
                    currentQuestion = new QuestionDTO();
                    currentAnswers = new HashSet<>();
                    
                    // Xử lý nội dung câu hỏi
                    String[] parts = text.split("\\.", 2);
                    currentQuestion.setQuestionText(parts[1].trim());
                    currentQuestion.setLevel(1); // Mặc định level 1
                }
                // Kiểm tra nếu là đáp án (bắt đầu bằng A, B, C, D)
                else if (text.matches("^[A-D]\\..*") && currentQuestion != null) {
                    AnswerDTO answer = new AnswerDTO();
                    String[] parts = text.split("\\.", 2);
                    answer.setAnswerText(parts[1].trim());
                    
                    // Kiểm tra đáp án đúng (có dấu * ở cuối)
                    if (text.endsWith("*")) {
                        answer.setIsCorrect(1);
                        answer.setAnswerText(answer.getAnswerText().substring(0, answer.getAnswerText().length() - 1).trim());
                    } else {
                        answer.setIsCorrect(0);
                    }
                    
                    currentAnswers.add(answer);
                }
            }
            
            // Thêm câu hỏi cuối cùng
            if (currentQuestion != null) {
                currentQuestion.setAnswers(currentAnswers);
                questions.add(currentQuestion);
            }
        }
        
        return questions;
    }
} 