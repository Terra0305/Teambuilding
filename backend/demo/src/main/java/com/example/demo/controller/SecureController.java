package com.example.demo.controller;

import com.example.demo.user.User; // User 클래스 임포트
import com.example.demo.user.UserRepository; // UserRepository 임포트
import lombok.RequiredArgsConstructor; // RequiredArgsConstructor 임포트
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.Collections; // Collections 임포트
import java.util.Map; // Map 임포트

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor // UserRepository 주입을 위해 추가
public class SecureController {

    private final UserRepository userRepository; // UserRepository 주입

    @GetMapping("/secure")
    public String secureEndpoint(Principal principal) {
        return "🔐 Hello, " + principal.getName() + "! You are authenticated.";
    }

    @GetMapping("/my-roles")
    public Map<String, Long> getMyRoles(Principal principal) { // Map<String, Long>으로 변경
        if (principal == null) {
            return Collections.emptyMap(); // 인증되지 않은 경우 빈 맵 반환
        }
        String username = principal.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다.")); // 사용자 찾기
        return Collections.singletonMap("userId", user.getId()); // 사용자 ID 반환
    }
}