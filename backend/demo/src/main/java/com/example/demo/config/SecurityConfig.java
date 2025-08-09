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
                // H2 콘솔과 정적 리소스는 무조건 허용
                .requestMatchers(PathRequest.toH2Console()).permitAll()
                .requestMatchers(PathRequest.toStaticResources().atCommonLocations()).permitAll()
                
                // ✅ 기본 웹 페이지들 허용 (여기가 핵심!)
                .requestMatchers("/", "/home", "/login", "/signup", "/login-success").permitAll()
                
                // ✅ 에러 페이지 허용 (이게 핵심!)
                .requestMatchers("/error").permitAll()
                
                // 회원가입, 로그인 API는 무조건 허용
                .requestMatchers("/api/signup", "/api/login").permitAll()
                
                // 기차 검색 API도 허용 (원하면 나중에 인증 필요하게 변경 가능)
                .requestMatchers("/api/trains").permitAll()
                
                // 정적 파일들 (CSS, JS, 이미지 등) 허용
                .requestMatchers("/css/**", "/js/**", "/images/**", "/static/**", "/favicon.ico").permitAll()
                
                // 나머지 API들은 인증 필요 (JWT 토큰 있어야 함)
                .anyRequest().authenticated()
            );

        // H2 콘솔은 프레임을 사용하므로, 관련 헤더 설정 허용
        http
            .headers(headers -> headers
                .frameOptions(frameOptions -> frameOptions.sameOrigin())
            );

        // JWT 필터를 UsernamePasswordAuthenticationFilter 앞에 추가
        http
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}