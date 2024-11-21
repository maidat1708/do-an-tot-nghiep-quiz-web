package com.example.samuel_quiz.service.impl;

import com.example.samuel_quiz.dto.answer.AnswerDTO;
import com.example.samuel_quiz.dto.question.QuestionDTO;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ExcelService {
    
    public List<QuestionDTO> readQuestionsFromExcel(MultipartFile file) throws IOException {
        List<QuestionDTO> questions = new ArrayList<>();
        
        try (Workbook workbook = new XSSFWorkbook(file.getInputStream())) {
            Sheet sheet = workbook.getSheetAt(0);
            
            Iterator<Row> rows = sheet.iterator();
            if (rows.hasNext()) {
                rows.next(); // Skip header row
            }
            
            while (rows.hasNext()) {
                Row row = rows.next();
                
                QuestionDTO question = new QuestionDTO();
                question.setQuestionText(getCellValueAsString(row.getCell(0)));
                question.setLevel(Integer.parseInt(getCellValueAsString(row.getCell(1))));
                
                Set<AnswerDTO> answers = new HashSet<>();
                for (int i = 0; i < 4; i++) {
                    AnswerDTO answer = new AnswerDTO();
                    answer.setAnswerText(getCellValueAsString(row.getCell(2 + i*2)));
                    answer.setIsCorrect(Integer.parseInt(getCellValueAsString(row.getCell(3 + i*2))));
                    answers.add(answer);
                }
                question.setAnswers(answers);
                
                questions.add(question);
            }
        }
        
        return questions;
    }
    
    private String getCellValueAsString(Cell cell) {
        if (cell == null) {
            return "";
        }
        
        switch (cell.getCellType()) {
            case NUMERIC:
                if (DateUtil.isCellDateFormatted(cell)) {
                    return cell.getDateCellValue().toString();
                }
                return String.valueOf((int) cell.getNumericCellValue());
            case STRING:
                return cell.getStringCellValue();
            case BOOLEAN:
                return String.valueOf(cell.getBooleanCellValue());
            case FORMULA:
                return cell.getCellFormula();
            default:
                return "";
        }
    }
} 