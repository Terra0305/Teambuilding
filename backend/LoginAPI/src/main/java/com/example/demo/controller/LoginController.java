package com.example.demo.controller;

import com.example.demo.dto.LoginRequest;
import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequiredArgsConstructor
public class LoginController {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody LoginRequest request) {
        System.out.println("--- 로그인 시도 ---");
        System.out.println("입력된 아이디: " + request.getUsername());

        Map<String, Object> response = new HashMap<>();

        Optional<User> userOpt = userRepository.findByUsername(request.getUsername());

        if (userOpt.isEmpty()) {
            System.out.println("결과: 존재하지 않는 사용자입니다.");
            response.put("success", false);
            response.put("message", "존재하지 않는 사용자입니다");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }

        User user = userOpt.get();
        System.out.println("DB에 저장된 비밀번호: " + user.getPassword());

        boolean passwordMatches = passwordEncoder.matches(request.getPassword(), user.getPassword());
        System.out.println("비밀번호 일치 여부: " + passwordMatches);

        if (!passwordMatches) {
            System.out.println("결과: 비밀번호가 틀렸습니다.");
            response.put("success", false);
            response.put("message", "비밀번호가 틀렸습니다");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }

        String token = jwtUtil.createToken(user.getUsername());
        System.out.println("결과: 로그인 성공, 토큰 발급.");

        response.put("success", true);
        response.put("message", "로그인 성공");
        response.put("token", token);

        return ResponseEntity.ok(response);
    }
}