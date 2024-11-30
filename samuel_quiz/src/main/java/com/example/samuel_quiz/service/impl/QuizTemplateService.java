package com.example.samuel_quiz.service.impl;

import com.example.samuel_quiz.exception.AppException;
import com.example.samuel_quiz.exception.ErrorCode;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.apache.poi.xwpf.usermodel.*;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.font.PDFont;
import org.apache.pdfbox.pdmodel.font.PDType0Font;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class QuizTemplateService {

    public byte[] generateWordTemplate() throws IOException {
        try (XWPFDocument doc = new XWPFDocument()) {
            // Tạo phần hướng dẫn
            XWPFParagraph titlePara = doc.createParagraph();
            titlePara.setAlignment(ParagraphAlignment.CENTER);
            XWPFRun titleRun = titlePara.createRun();
            titleRun.setBold(true);
            titleRun.setFontSize(14);
            titleRun.setText("HƯỚNG DẪN ĐỊNH DẠNG ĐỀ THI");
            titleRun.addBreak();
            
            // Thêm các quy tắc định dạng
            XWPFParagraph rulePara = doc.createParagraph();
            XWPFRun ruleRun = rulePara.createRun();
            ruleRun.setFontSize(12);
            ruleRun.setText("1. Định dạng câu hỏi:");
            ruleRun.addBreak();
            ruleRun.setText("   - Mỗi câu hỏi bắt đầu bằng số và dấu chấm (VD: 1., 2., ...)");
            ruleRun.addBreak();
            ruleRun.setText("   - Nội dung câu hỏi viết ngay sau số thứ tự");
            ruleRun.addBreak();
            ruleRun.addBreak();
            
            ruleRun.setText("2. Định dạng đáp án:");
            ruleRun.addBreak();
            ruleRun.setText("   - Mỗi đáp án bắt đầu bằng chữ cái và dấu chấm (VD: A., B., C., D.)");
            ruleRun.addBreak();
            ruleRun.setText("   - Đáp án đúng được đánh dấu bằng dấu * ở cuối");
            ruleRun.addBreak();
            ruleRun.addBreak();

            // Thêm ví dụ
            XWPFParagraph examplePara = doc.createParagraph();
            XWPFRun exampleRun = examplePara.createRun();
            exampleRun.setBold(true);
            exampleRun.setText("Ví dụ mẫu:");
            exampleRun.addBreak();
            exampleRun.addBreak();

            XWPFRun sampleRun = examplePara.createRun();
            sampleRun.setText("1. Thủ đô của Việt Nam là gì?");
            sampleRun.addBreak();
            sampleRun.setText("A. Hà Nội*");
            sampleRun.addBreak();
            sampleRun.setText("B. Hồ Chí Minh");
            sampleRun.addBreak();
            sampleRun.setText("C. Đà Nẵng");
            sampleRun.addBreak();
            sampleRun.setText("D. Hải Phòng");
            sampleRun.addBreak();
            sampleRun.addBreak();

            sampleRun.setText("2. Việt Nam có bao nhiêu tỉnh thành?");
            sampleRun.addBreak();
            sampleRun.setText("A. 61");
            sampleRun.addBreak();
            sampleRun.setText("B. 62");
            sampleRun.addBreak();
            sampleRun.setText("C. 63*");
            sampleRun.addBreak();
            sampleRun.setText("D. 64");

            ByteArrayOutputStream out = new ByteArrayOutputStream();
            doc.write(out);
            return out.toByteArray();
        }
    }

    public byte[] generatePDFTemplate() throws IOException {
        try (PDDocument doc = new PDDocument()) {
            PDPage page = new PDPage(PDRectangle.A4);
            doc.addPage(page);

            // Tải font từ resources
            PDFont customFont = PDType0Font.load(doc, new ClassPathResource("fonts/NotoSans-Regular.ttf").getInputStream());
            
            try (PDPageContentStream content = new PDPageContentStream(doc, page)) {
                content.beginText();
                // Sử dụng font mới
                content.setFont(customFont, 14);
                content.newLineAtOffset(180, 750);
                content.showText("HƯỚNG DẪN ĐỊNH DẠNG ĐỀ THI");
                
                content.setFont(customFont, 12);
                float leading = 15;
                
                // Quy tắc định dạng
                content.newLineAtOffset(-130, -40);
                content.showText("1. Định dạng câu hỏi:");
                content.newLineAtOffset(0, -leading);
                content.showText("   - Mỗi câu hỏi bắt đầu bằng số và dấu chấm (VD: 1., 2., ...)");
                content.newLineAtOffset(0, -leading);
                content.showText("   - Nội dung câu hỏi viết ngay sau số thứ tự");
                
                content.newLineAtOffset(0, -2*leading);
                content.showText("2. Định dạng đáp án:");
                content.newLineAtOffset(0, -leading);
                content.showText("   - Mỗi đáp án bắt đầu bằng chữ cái và dấu chấm (VD: A., B., C., D.)");
                content.newLineAtOffset(0, -leading);
                content.showText("   - Đáp án đúng được đánh dấu bằng dấu * ở cuối");
                
                // Ví dụ
                content.setFont(customFont, 12);
                content.newLineAtOffset(0, -2*leading);
                content.showText("Ví dụ mẫu:");
                
                content.setFont(customFont, 12);
                content.newLineAtOffset(0, -2*leading);
                content.showText("1. Thủ đô của Việt Nam là gì?");
                content.newLineAtOffset(0, -leading);
                content.showText("A. Hà Nội*");
                content.newLineAtOffset(0, -leading);
                content.showText("B. Hồ Chí Minh");
                content.newLineAtOffset(0, -leading);
                content.showText("C. Đà Nẵng");
                content.newLineAtOffset(0, -leading);
                content.showText("D. Hải Phòng");
                
                content.newLineAtOffset(0, -2*leading);
                content.showText("2. Việt Nam có bao nhiêu tỉnh thành?");
                content.newLineAtOffset(0, -leading);
                content.showText("A. 61");
                content.newLineAtOffset(0, -leading);
                content.showText("B. 62");
                content.newLineAtOffset(0, -leading);
                content.showText("C. 63*");
                content.newLineAtOffset(0, -leading);
                content.showText("D. 64");
                
                content.endText();
            }

            ByteArrayOutputStream out = new ByteArrayOutputStream();
            doc.save(out);
            return out.toByteArray();
        }
    }
} 