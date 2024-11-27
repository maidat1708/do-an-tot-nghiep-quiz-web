package com.example.samuel_quiz;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@SpringBootApplication
@EnableConfigurationProperties
public class SamuelQuizApplication {

	public static void main(String[] args) {
		SpringApplication.run(SamuelQuizApplication.class, args);
	}

}
