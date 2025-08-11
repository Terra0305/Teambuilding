package com.example.demo.user;

import com.example.demo.user.dto.SignupRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/signup")
    public ResponseEntity<Map<String, Object>> signup(@RequestBody SignupRequest request) {
        Map<String, Object> response = new HashMap<>();
        
        // 디버깅: 받은 데이터 로그 출력
        System.out.println("=== 회원가입 요청 데이터 ===");
        System.out.println("username: " + request.getUsername());
        System.out.println("password: " + request.getPassword());
        System.out.println("passwordConfirm: " + request.getPasswordConfirm());
        System.out.println("비밀번호 일치 여부: " + (request.getPassword() != null && request.getPassword().equals(request.getPasswordConfirm())));
        
        // 기존: 아이디 중복 체크
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            response.put("success", false);
            response.put("message", "이미 존재하는 아이디입니다.");
            return ResponseEntity.badRequest().body(response);
        }
        
        
        // 추가: 비밀번호 확인 체크
        if (request.getPassword() == null || request.getPasswordConfirm() == null || 
            !request.getPassword().equals(request.getPasswordConfirm())) {
            response.put("success", false);
            response.put("message", "비밀번호가 일치하지 않습니다.");
            response.put("debug_password", request.getPassword());
            response.put("debug_passwordConfirm", request.getPasswordConfirm());
            return ResponseEntity.badRequest().body(response);
        }
        
        // 기존: 회원가입 처리 (name 대신 username 사용)
        String encodedPassword = passwordEncoder.encode(request.getPassword());
        User newUser = new User(request.getUsername(), encodedPassword, request.getUsername());
        userRepository.save(newUser);
        
        response.put("success", true);
        response.put("message", "회원가입 성공");
        System.out.println("=== 회원가입 성공 응답 전송 ===");
        return ResponseEntity.ok(response);
    }

    }