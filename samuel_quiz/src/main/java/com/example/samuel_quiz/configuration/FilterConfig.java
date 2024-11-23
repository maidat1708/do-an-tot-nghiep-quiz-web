package com.example.samuel_quiz.configuration;

import com.example.samuel_quiz.utils.RequestBodyCachingFilter;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class FilterConfig {

    @Bean
    public FilterRegistrationBean<RequestBodyCachingFilter> loggingFilter() {
        FilterRegistrationBean<RequestBodyCachingFilter> registrationBean = new FilterRegistrationBean<>();
        registrationBean.setFilter(new RequestBodyCachingFilter());
        registrationBean.addUrlPatterns("/*"); // Áp dụng cho tất cả các endpoint
        return registrationBean;
    }
}