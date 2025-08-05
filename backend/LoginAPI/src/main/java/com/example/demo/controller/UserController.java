package com.example.demo.controller;

import com.example.demo.dto.SignupRequest;
import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/signup")
    public ResponseEntity<Map<String, Object>> signup(@RequestBody SignupRequest request) {
        Map<String, Object> response = new HashMap<>();

        // 1. 아이디 중복 체크
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            response.put("success", false);
            response.put("message", "이미 존재하는 사용자입니다");
            return ResponseEntity.badRequest().body(response);
        }

        // 2. 비밀번호 암호화 및 저장
        User newUser = new User();
        newUser.setUsername(request.getUsername());
        newUser.setPassword(passwordEncoder.encode(request.getPassword()));
        userRepository.save(newUser);

        response.put("success", true);
        response.put("message", "회원가입 성공");

        return ResponseEntity.ok(response);
    }
}
