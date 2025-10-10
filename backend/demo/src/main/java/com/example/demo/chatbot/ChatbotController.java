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
            Long userId = userDetails.getUser().getId();
            String response = geminiService.chat(request.getMessage(), userId);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", response
            ));
            
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "message", "챗봇 오류: " + e.getMessage()
            ));
        }
    }
    
    @Data
    static class ChatRequest {
        private String message;
    }
}
