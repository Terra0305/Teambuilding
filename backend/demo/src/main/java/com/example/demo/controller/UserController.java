package com.example.demo.controller;

import com.example.demo.dto.SignupRequest;
import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/api/signup")
    public ResponseEntity<Map<String, Object>> signup(@RequestBody SignupRequest signupRequest) {
        Map<String, Object> response = new HashMap<>();

        // 사용자 이름 중복 확인 (선택 사항, 필요시 추가)
        if (userRepository.findByUsername(signupRequest.getUsername()).isPresent()) {
            response.put("success", false);
            response.put("message", "이미 존재하는 사용자 이름입니다.");
            return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
        }

        User user = new User();
        user.setUsername(signupRequest.getUsername());
        user.setPassword(passwordEncoder.encode(signupRequest.getPassword())); // 비밀번호 인코딩
        userRepository.save(user);

        response.put("success", true);
        response.put("message", "회원가입 성공!");
        return ResponseEntity.ok(response);
    }
}
