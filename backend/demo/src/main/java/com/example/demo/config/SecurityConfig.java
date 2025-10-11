package com.example.demo.config;

import com.example.demo.config.jwt.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.autoconfigure.security.servlet.PathRequest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        // CSRF, Form Login, HTTP Basic 비활성화
        http
            .csrf(AbstractHttpConfigurer::disable)
            .formLogin(AbstractHttpConfigurer::disable)
            .httpBasic(AbstractHttpConfigurer::disable)
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        // URL 별 접근 권한 설정
        http
            .authorizeHttpRequests(auth -> auth
                // 정적 리소스는 무조건 허용
                .requestMatchers(PathRequest.toStaticResources().atCommonLocations()).permitAll()

                // ✅ 기본 웹 페이지들 허용
                .requestMatchers("/", "/home", "/login", "/signup", "/login-success", "/mypage", "/dummy/**").permitAll()

                // ✅ 에러 페이지 허용
                .requestMatchers("/error").permitAll()

                // 회원가입, 로그인 API는 무조건 허용
                .requestMatchers("/api/signup", "/api/login").permitAll()

                // ⭐ 기차 검색 API도 허용 (이게 핵심!)
                .requestMatchers("/api/trains", "/api/trains/**").permitAll()

                // ✅ 프로토타입 HTML 파일 허용
                .requestMatchers("/voice-prototype.html", "/chat-prototype.html", "/train-reserve").permitAll()

                // 정적 파일들 (CSS, JS, 이미지 등) 허용
                .requestMatchers("/css/**", "/js/**", "/images/**", "/static/**", "/favicon.ico").permitAll()

                // 나머지 API들은 인증 필요 (JWT 토큰 있어야 함)
                .anyRequest().authenticated()
            );

        // JWT 필터를 UsernamePasswordAuthenticationFilter 앞에 추가
        http
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}