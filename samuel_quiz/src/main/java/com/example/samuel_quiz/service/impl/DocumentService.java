package com.example.samuel_quiz.service.impl;

import com.example.samuel_quiz.dto.answer.AnswerDTO;
import com.example.samuel_quiz.dto.question.QuestionDTO;
import com.example.samuel_quiz.entities.Template;
import com.example.samuel_quiz.exception.AppException;
import com.example.samuel_quiz.exception.ErrorCode;
import com.example.samuel_quiz.repository.TemplateRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.font.PDType0Font;
import org.apache.pdfbox.text.PDFTextStripper;
import org.apache.poi.xwpf.usermodel.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Service;
import org.apache.pdfbox.pdmodel.font.PDType1Font;

import java.io.*;
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class DocumentService {

    TemplateRepository templateRepository;
    ResourceLoader resourceLoader;

    public byte[] createWordQuiz(Long templateId, List<QuestionDTO> questions, String quizName, Long duration) throws IOException {
        Template template = templateRepository.findById(templateId)
                .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND, "Template not found"));

        try (XWPFDocument doc = new XWPFDocument(new FileInputStream(template.getFilePath()))) {
            // Thay thế các placeholder trong header
            for (XWPFParagraph paragraph : doc.getParagraphs()) {
                List<XWPFRun> runs = paragraph.getRuns();
                if (runs != null) {
                    for (XWPFRun run : runs) {
                        String text = run.getText(0);
                        if (text != null) {
                            text = text.replace("{{QUIZ_NAME}}", quizName)
                                     .replace("{{DURATION}}", String.valueOf(duration))
                                     .replace("{{TOTAL_QUESTIONS}}", String.valueOf(questions.size()));
                            run.setText(text, 0);
                        }
                    }
                }
            }

            // Tìm và thay thế placeholder {{QUESTIONS}}
            for (XWPFParagraph paragraph : doc.getParagraphs()) {
                if (paragraph.getText().contains("{{QUESTIONS}}")) {
                    // Xóa placeholder
                    for (XWPFRun run : paragraph.getRuns()) {
                        run.setText("", 0);
                    }

                    // Thêm các câu hỏi
                    for (int i = 0; i < questions.size(); i++) {
                        QuestionDTO question = questions.get(i);

                        // Tạo paragraph cho câu hỏi
                        XWPFParagraph qParagraph = doc.insertNewParagraph(paragraph.getCTP().newCursor());
                        XWPFRun qRun = qParagraph.createRun();
                        qRun.setText(String.format("Câu %d: %s", (i + 1), question.getQuestionText()));
                        qRun.addBreak();

                        // Thêm các đáp án
                        char answerLabel = 'A';
                        for (AnswerDTO answer : question.getAnswers()) {
                            XWPFRun aRun = qParagraph.createRun();
                            aRun.setText(String.format("    %c. %s", answerLabel, answer.getAnswerText()));
                            aRun.addBreak();
                            answerLabel++;
                        }

                        // Thêm khoảng trống giữa các câu hỏi
                        if (i < questions.size() - 1) {
                            qRun.addBreak();
                        }
                    }
                    break; // Dừng lại sau khi chèn câu hỏi
                }
            }

            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            doc.write(outputStream);
            return outputStream.toByteArray();
        }
    }

    public byte[] createPDFQuiz(Long templateId, List<QuestionDTO> questions, String quizName, Long duration) throws IOException {
        Template template = templateRepository.findById(templateId)
                .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND, "Template not found"));

        try (PDDocument document = PDDocument.load(new File(template.getFilePath()))) {
            // Load font từ resources
            PDType0Font font;
            Resource fontResource = resourceLoader.getResource("classpath:fonts/NotoSans-Regular.ttf");
            try (InputStream fontStream = fontResource.getInputStream()) {
                font = PDType0Font.load(document, fontStream);
            } catch (IOException e) {
                throw new AppException(ErrorCode.UNCATEGORIZED_EXCEPTION, "Error loading font: " + e.getMessage());
            }

            // Đọc nội dung từ template trước
            PDFTextStripper stripper = new PDFTextStripper();
            String content = stripper.getText(document);
            String[] lines = content.split("\n");

            // Xóa tất cả các trang hiện có
            while (document.getNumberOfPages() > 0) {
                document.removePage(0);
            }

            // Tạo trang mới
            PDPage currentPage = new PDPage(PDRectangle.A4);
            document.addPage(currentPage);

            float margin = 50;
            float yPosition = currentPage.getMediaBox().getHeight() - margin;
            float fontSize = 12;
            float leading = 14.5f;

            PDPageContentStream contentStream = new PDPageContentStream(document, currentPage);
            contentStream.beginText();
            contentStream.setFont(font, fontSize);
            contentStream.setLeading(leading);
            contentStream.newLineAtOffset(margin, yPosition);

            // Xử lý từng dòng
            for (String line : lines) {
                // Thay thế các placeholder
                if (line.contains("{{QUIZ_NAME}}")) {
                    line = line.replace("{{QUIZ_NAME}}", quizName);
                }
                if (line.contains("{{DURATION}}")) {
                    line = line.replace("{{DURATION}}", String.valueOf(duration));
                }
                if (line.contains("{{TOTAL_QUESTIONS}}")) {
                    line = line.replace("{{TOTAL_QUESTIONS}}", String.valueOf(questions.size()));
                }

                if (line.contains("{{QUESTIONS}}")) {
                    for (int i = 0; i < questions.size(); i++) {
                        QuestionDTO question = questions.get(i);

                        // Kiểm tra nếu cần trang mới
                        if (yPosition < margin + leading * 4) {
                            contentStream.endText();
                            contentStream.close();

                            currentPage = new PDPage(PDRectangle.A4);
                            document.addPage(currentPage);
                            contentStream = new PDPageContentStream(document, currentPage, PDPageContentStream.AppendMode.APPEND, true);
                            contentStream.beginText();
                            contentStream.setFont(font, fontSize);
                            contentStream.setLeading(leading);
                            contentStream.newLineAtOffset(margin, currentPage.getMediaBox().getHeight() - margin);
                            yPosition = currentPage.getMediaBox().getHeight() - margin;
                        }

                        // In câu hỏi
                        contentStream.showText(String.format("Câu %d: %s", (i + 1), question.getQuestionText()));
                        contentStream.newLine();
                        yPosition -= leading;

                        // In các đáp án
                        char answerLabel = 'A';
                        for (AnswerDTO answer : question.getAnswers()) {
                            contentStream.showText(String.format("    %c. %s", answerLabel, answer.getAnswerText()));
                            contentStream.newLine();
                            yPosition -= leading;
                            answerLabel++;
                        }
                        contentStream.newLine();
                        yPosition -= leading;
                    }
                } else {
                    contentStream.showText(line);
                    contentStream.newLine();
                    yPosition -= leading;
                }
            }

            contentStream.endText();
            contentStream.close();

            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            document.save(outputStream);
            return outputStream.toByteArray();
        } catch (IOException e) {
            throw new AppException(ErrorCode.UNCATEGORIZED_EXCEPTION, "Error creating PDF quiz: " + e.getMessage());
        }
    }

    private XWPFParagraph findOrCreateParagraph(XWPFDocument doc, String placeholder) {
        for (XWPFParagraph paragraph : doc.getParagraphs()) {
            if (paragraph.getText().contains(placeholder)) {
                paragraph.getRuns().clear();
                return paragraph;
            }
        }
        return doc.createParagraph();
    }
} 