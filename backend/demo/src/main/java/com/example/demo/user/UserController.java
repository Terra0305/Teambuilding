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
        // ... (기존 회원가입 코드는 그대로) ...
        Map<String, Object> response = new HashMap<>();
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            response.put("success", false);
            response.put("message", "이미 존재하는 아이디입니다.");
            return ResponseEntity.badRequest().body(response);
        }
        String encodedPassword = passwordEncoder.encode(request.getPassword());
        User newUser = new User(request.getUsername(), encodedPassword, request.getName());
        userRepository.save(newUser);
        response.put("success", true);
        response.put("message", "회원가입 성공");
        return ResponseEntity.ok(response);
    }

    // ★★★ 디버깅용 테스트 API 추가 ★★★
    @GetMapping("/my-roles")
    public ResponseEntity<Map<String, Object>> getMyRoles(@AuthenticationPrincipal UserDetails userDetails) {
        Map<String, Object> response = new HashMap<>();
        if (userDetails == null) {
            response.put("error", "로그인되지 않은 사용자입니다.");
            return ResponseEntity.status(401).body(response);
        }
        response.put("username", userDetails.getUsername());
        response.put("authorities", userDetails.getAuthorities().stream()
                                            .map(GrantedAuthority::getAuthority)
                                            .collect(Collectors.toList()));
        return ResponseEntity.ok(response);
    }
}