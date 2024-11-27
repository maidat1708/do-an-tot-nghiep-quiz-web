package com.example.samuel_quiz.utils;

import lombok.experimental.UtilityClass;

@UtilityClass
public class Constant {
    public static final String TIMESTAMP_DATE_PATTERN = "yyyy-MM-dd'T'HH:mm:ssXXX";
    public static final String TIMESTAMP_DATE_PATTERN_UTC = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'";
    public static final String TIMESTAMP_DATE_PATTERN_UTC_2 = "yyyy-MM-dd'T'HH:mm:ss'Z'";
    public static final String TIMESTAMP_DATE_PATTERN_DEFAULT = "yyyy-MM-dd";
    public static final String TIMESTAMP_DATE_PATTERN_DEFAULT_2 = "dd-MM-yyyy";
    public static final String TIMESTAMP_DATE_PATTERN_DEFAULT_3 = "dd-MM-yyyy'T'HH:mm:ss";
    public static final String YEAR_AND_MONTH_PATTERN = "yyyyMM";
    public static final String C06_DATE_PATTERN = "yyyyMMdd";
    public static final String OCR_DATE_PATTERN = "dd-MM-yyyy";
    public static final String FE_DATE_PATTERN = "dd/MM/yyyy";
    public static final String TIME_STAMP_FE_DATE = "dd/MM/yyyy HH:mm:ss";
    public static final String TIME_STAMP_EXPORT_DATE = "ddMMyyyyHHmmss";
    public static final String DATE_TIME_NO_SYMBOL_PATTERN = "yyyyMMddHHmmss";
    public static final String REGEX_VALID_ID_NO = "^[0-9]+$";
    public static final String YEAR = "yy";
    public static final String TIMESTAMP_DATE_PATTERN_SIMPLE = "yyyy-MM-dd'T'HH:mm:ss";

    public class FileType {
        public static final String PDF = "application/pdf";
        public static final String DOC = "application/msword";
        public static final String DOCX = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

        private FileType() {} // Prevent instantiation
    }

    public static final String TEMPLATE_DIR = "templates";
    public static final String RESOURCES_DIR = "src/main/resources";
}
