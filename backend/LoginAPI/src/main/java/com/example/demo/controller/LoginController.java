package com.example.demo.controller;

import com.example.demo.dto.LoginRequest;
import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

/**
 * POST /api/login  — 로그인 API
 * Lombok @RequiredArgsConstructor 로 UserRepository를 생성자 주입.
 */
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class LoginController {

    private final UserRepository userRepository;   // DB 접근용 JPA 리포지토리

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody LoginRequest request) {

        Map<String, Object> response = new HashMap<>();

        // 1) 아이디로 사용자 조회
        Optional<User> userOpt = userRepository.findByUsername(request.getUsername());

        if (userOpt.isEmpty()) {                     // 존재하지 않음
            response.put("success", false);
            response.put("message", "존재하지 않는 사용자입니다");
            return ResponseEntity.ok(response);
        }

        User user = userOpt.get();

        // 2) 비밀번호 검증 (추후 BCrypt 적용 예정)
        if (user.getPassword().equals(request.getPassword())) {
            response.put("success", true);
            response.put("message", "로그인 성공");
            // TODO: JWT 토큰 발급 등
        } else {
            response.put("success", false);
            response.put("message", "비밀번호가 틀렸습니다");
        }

        return ResponseEntity.ok(response);
    }
}
