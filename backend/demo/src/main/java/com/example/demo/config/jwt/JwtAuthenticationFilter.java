package com.example.demo.config.jwt;

import com.example.demo.security.UserDetailsServiceImpl;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final UserDetailsServiceImpl userDetailsService;

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request,
                                    @NonNull HttpServletResponse response,
                                    @NonNull FilterChain filterChain)
            throws ServletException, IOException {

        try {
            // ⭐ 인증이 필요하지 않은 경로는 건너뛰기
            String requestURI = request.getRequestURI();
            System.out.println("JWT Filter - URI: " + requestURI);
            
            if (isPublicPath(requestURI)) {
                System.out.println("  -> Public path, 인증 건너뛰기");
                filterChain.doFilter(request, response);
                return;
            }

            String token = parseToken(request);
            System.out.println("  -> Token: " + (token != null ? "exists" : "null"));

            if (token != null && jwtUtil.validateToken(token)) {
                String username = jwtUtil.getUsernameFromToken(token);
                System.out.println("  -> Username: " + username);
                
                if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                    UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                    if (userDetails != null) {
                        UsernamePasswordAuthenticationToken authentication =
                                new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                        authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                        SecurityContextHolder.getContext().setAuthentication(authentication);
                        System.out.println("  -> 인증 성공!");
                    }
                }
            } else {
                System.out.println("  -> Token 검증 실패 또는 null");
            }

        } catch (Exception e) {
            System.err.println("JWT Filter 오류: " + e.getMessage());
            // 오류가 발생해도 계속 진행 (인증되지 않은 상태로)
        }

        filterChain.doFilter(request, response);
    }

    private String parseToken(HttpServletRequest request) {
        String header = request.getHeader("Authorization");
        if (StringUtils.hasText(header) && header.startsWith("Bearer ")) {
            return header.substring(7);
        }
        return null;
    }

    // ⭐ 인증이 필요하지 않은 경로 체크
    private boolean isPublicPath(String path) {
        return path.startsWith("/api/trains") ||
               path.startsWith("/api/signup") ||
               path.startsWith("/api/login") ||
               path.startsWith("/h2-console") ||
               path.startsWith("/error") ||
               path.equals("/") ||
               path.equals("/home") ||
               path.equals("/login") ||
               path.equals("/signup") ||
               path.equals("/login-success") ||
               path.startsWith("/css/") ||
               path.startsWith("/js/") ||
               path.startsWith("/images/") ||
               path.startsWith("/static/");
    }
}