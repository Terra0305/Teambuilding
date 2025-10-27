package com.example.demo.chatbot;

import com.example.demo.security.UserDetailsImpl;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/chatbot")
@RequiredArgsConstructor
public class ChatbotController {
    
    private final GeminiService geminiService;

    @GetMapping("/history")
    public ResponseEntity<?> getHistory(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).body(Map.of("success", false, "message", "로그인이 필요합니다."));
        }
        Long userId = userDetails.getUser().getId();
        List<ChatMessage> history = geminiService.getChatHistory(userId);

        // DTO로 변환하여 반환 (백엔드에서 내용 파싱)
        com.google.gson.Gson gson = new com.google.gson.Gson();
        List<Map<String, String>> historyDto = history.stream()
                .map(msg -> {
                    // 'user' 역할의 메시지는 항상 포함
                    if ("user".equals(msg.getRole())) {
                        try {
                            com.google.gson.JsonObject contentJson = gson.fromJson(msg.getContent(), com.google.gson.JsonObject.class);
                            String text = contentJson.getAsJsonArray("parts").get(0).getAsJsonObject().get("text").getAsString();
                            return Map.of("role", "user", "content", text);
                        } catch (Exception e) {
                            return Map.of("role", "user", "content", msg.getContent()); // 파싱 실패 시 원본
                        }
                    }
                    // 'model' 역할의 메시지는 'text'를 포함할 때만 포함 (functionCall 제외)
                    if ("model".equals(msg.getRole())) {
                        try {
                            com.google.gson.JsonObject contentJson = gson.fromJson(msg.getContent(), com.google.gson.JsonObject.class);
                            com.google.gson.JsonObject firstPart = contentJson.getAsJsonArray("parts").get(0).getAsJsonObject();
                            if (firstPart.has("text")) {
                                String text = firstPart.get("text").getAsString();
                                return Map.of("role", "model", "content", text);
                            }
                        } catch (Exception e) {
                            // 파싱 실패 또는 부적절한 형식의 메시지는 무시
                        }
                    }
                    // 그 외(function 등)는 표시하지 않음
                    return null;
                })
                .filter(java.util.Objects::nonNull)
                .collect(Collectors.toList());

        return ResponseEntity.ok(Map.of("success", true, "history", historyDto));
    }
    
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
            if (userDetails == null) {
                return ResponseEntity.status(401).body(Map.of("success", false, "message", "로그인이 필요합니다."));
            }
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
