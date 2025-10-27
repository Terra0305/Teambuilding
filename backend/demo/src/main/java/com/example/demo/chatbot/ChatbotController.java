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
                    String readableContent = "";
                    if ("user".equals(msg.getRole()) || "model".equals(msg.getRole())) {
                        try {
                            com.google.gson.JsonObject contentJson = gson.fromJson(msg.getContent(), com.google.gson.JsonObject.class);
                            com.google.gson.JsonArray parts = contentJson.getAsJsonArray("parts");
                            if (parts != null && !parts.isEmpty()) {
                                com.google.gson.JsonObject firstPart = parts.get(0).getAsJsonObject();
                                if (firstPart.has("text")) {
                                    readableContent = firstPart.get("text").getAsString();
                                } else if (firstPart.has("functionCall")) {
                                    com.google.gson.JsonObject functionCall = firstPart.getAsJsonObject("functionCall");
                                    String functionName = functionCall.get("name").getAsString();
                                    readableContent = "[Function Call: " + functionName + "]";
                                }
                            }
                        } catch (Exception e) {
                            // JSON 파싱에 실패하면 원본 내용을 그대로 사용
                            readableContent = msg.getContent();
                        }
                    } else {
                        // 'user' 또는 'model' 역할이 아닌 메시지는 기록에 표시하지 않음
                        return null;
                    }
                    return Map.of("role", msg.getRole(), "content", readableContent);
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
