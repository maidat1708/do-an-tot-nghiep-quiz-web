package com.example.samuel_quiz.configuration;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.web.SecurityFilterChain;

import com.example.samuel_quiz.enums.Role;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig{

    // private final String[] PUBLIC_ENDPOINTS = { "/users",
    // };

    @Value("${jwt.signerKey}")
    private String SIGNER_KEY;

    @Autowired
    private CustomJWTDecoder customJWTDecoder;

    @Autowired
    private WebConfig webConfig;
    // accept all request
    // @Bean
    // public SecurityFilterChain filterChain(HttpSecurity httpSecurity) throws
    // Exception {
    // httpSecurity
    // .authorizeHttpRequests(request -> request.anyRequest().permitAll());

    // httpSecurity.csrf(AbstractHttpConfigurer::disable);

    // return httpSecurity.build();
    // }
    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration corsConfiguration = new CorsConfiguration();
        corsConfiguration.addAllowedOrigin("*");  // Cho phép tất cả các nguồn gốc
        corsConfiguration.addAllowedMethod("*");  // Cho phép tất cả các phương thức (GET, POST, PUT, DELETE...)
        corsConfiguration.addAllowedHeader("*");  // Cho phép tất cả các tiêu đề
        corsConfiguration.addExposedHeader("Content-Disposition"); // Thêm dòng này để cho phép download file

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", corsConfiguration);  // Áp dụng cho tất cả các đường dẫn

        return new CorsFilter(source);
    }

    // Authorization
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity httpSecurity) throws Exception {
        httpSecurity.addFilterBefore(corsFilter(), CorsFilter.class);
        httpSecurity
                .authorizeHttpRequests(request -> request
                        .requestMatchers("/swagger-ui.html", "/v3/api-docs/**", "/swagger-ui/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/users", "auth/verify", "auth/login", "auth/logout","auth/refresh", "auth/register").permitAll()
                        .requestMatchers(HttpMethod.GET, "/products").permitAll()
                        // if use hasRole -> have to custom authority prefix ->
                        // use jwtAuthenticationConverter -> change "SCOPE_ADMIN" -> "ROLE_ADMIN"
                        .requestMatchers(HttpMethod.GET, "/products/{productId}").hasAnyRole(Role.STUDENT.name(),Role.ADMIN.name(),Role.TEACHER.name())
                        .requestMatchers("/products/**", "/users").hasRole(Role.ADMIN.name())
                        .requestMatchers("/comments/**").hasAnyRole(Role.STUDENT.name(),Role.ADMIN.name(),Role.TEACHER.name())
                        .anyRequest().authenticated())
                .csrf(AbstractHttpConfigurer::disable);
        // return exception if role is incorrect
        httpSecurity.exceptionHandling(exception -> exception.accessDeniedHandler(new CustomAccessDeniedHandler()));

        // must have token to accept request. ex patterns get user by id
        httpSecurity.oauth2ResourceServer(oauth2 -> oauth2.jwt(jwtConfigurer -> jwtConfigurer.decoder(customJWTDecoder)
                // convert SOPCE -> ROLE -> use hasRole
                .jwtAuthenticationConverter(jwtAuthenticationConverter()))
                // if check token fail -> exception -> unauthoticated
                .authenticationEntryPoint(new JwtAuthenticationEntryPoint()));
        return httpSecurity.build();
    }

    // convert SCOPE -> ROLE
    @Bean
    JwtAuthenticationConverter jwtAuthenticationConverter() {
        JwtGrantedAuthoritiesConverter jwtGrantedAuthoritiesConverter = new JwtGrantedAuthoritiesConverter();
        jwtGrantedAuthoritiesConverter.setAuthorityPrefix("ROLE_");

        JwtAuthenticationConverter jwtAuthenticationConverter = new JwtAuthenticationConverter();
        jwtAuthenticationConverter.setJwtGrantedAuthoritiesConverter(jwtGrantedAuthoritiesConverter);

        return jwtAuthenticationConverter;
    }

    // decode jwt -> authentication
    // @Bean
    // JwtDecoder JwtDecoder() {
    //     SecretKeySpec secretKeySpec = new SecretKeySpec(SIGNER_KEY.getBytes(), "HS512");
    //     return NimbusJwtDecoder
    //             .withSecretKey(secretKeySpec)
    //             .macAlgorithm(MacAlgorithm.HS512)
    //             .build();
    // }

    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(10);
    }
}