package com.example.demo.chatbot;

import com.example.demo.security.UserDetailsImpl;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/chatbot")
@RequiredArgsConstructor
public class ChatbotController {
    
    private final GeminiService geminiService;
    
    @PostMapping("/chat")
    public ResponseEntity<?> chat(
            @RequestBody ChatRequest request,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        
        try {
            System.out.println("=== 챗봇 요청 받음 ===");
            System.out.println("메시지: " + request.getMessage());
            System.out.println("UserDetails: " + userDetails);
            
            if (userDetails == null) {
                System.out.println("오류: userDetails가 null입니다!");
                return ResponseEntity.status(401).body(Map.of(
                    "success", false,
                    "message", "로그인이 필요합니다."
                ));
            }
            
            Long userId = userDetails.getUser().getId();
            System.out.println("User ID: " + userId);
            
            String response = geminiService.chat(request.getMessage(), userId);
            System.out.println("응답: " + response);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", response
            ));
            
        } catch (Exception e) {
            System.err.println("오류 발생: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "message", "챗봇 오류: " + e.getMessage()
            ));
        }
    }
    
    @PostMapping("/clear")
    public ResponseEntity<?> clearHistory(
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        try {
            Long userId = userDetails.getUser().getId();
            geminiService.clearHistory(userId);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "대화 히스토리가 초기화되었습니다."
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "message", "오류: " + e.getMessage()
            ));
        }
    }
    
    @Data
    static class ChatRequest {
        private String message;
    }
}
