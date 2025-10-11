package com.example.demo.chatbot;

import com.example.demo.chatbot.mcp.MCPService;
import com.example.demo.chatbot.mcp.MCPTool;
import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
public class GeminiService {
    
    @Value("${gemini.api.key}")
    private String apiKey;
    
    private final MCPService mcpService;
    private final Gson gson = new Gson();
    
    // 세션별 대화 히스토리 저장 (userId를 키로 사용)
    private final Map<Long, List<Map<String, Object>>> sessionHistories = new ConcurrentHashMap<>();
    
    private final WebClient webClient = WebClient.builder()
        .baseUrl("https://generativelanguage.googleapis.com/v1beta")
        .build();
    
    public String chat(String userMessage, Long userId) {
        try {
            System.out.println("=== 챗봇 요청 시작 ===");
            System.out.println("사용자: " + userMessage);
            System.out.println("User ID: " + userId);
            
            // 세션 히스토리 가져오기 (없으면 새로 생성)
            List<Map<String, Object>> conversationHistory = 
                sessionHistories.computeIfAbsent(userId, k -> new ArrayList<>());
            
            // 새 사용자 메시지 추가
            conversationHistory.add(Map.of(
                "role", "user",
                "parts", List.of(Map.of("text", userMessage))
            ));
            
            JsonObject response = callGeminiWithTools(conversationHistory, userId);
            return processGeminiResponse(response, conversationHistory, userId);
            
        } catch (WebClientResponseException e) {
            System.err.println("API 오류: " + e.getStatusCode());
            System.err.println("응답: " + e.getResponseBodyAsString());
            return "AI 서버 오류: " + e.getStatusCode();
        } catch (Exception e) {
            e.printStackTrace();
            return "오류: " + e.getMessage();
        }
    }
    
    // 대화 히스토리 초기화 (새 대화 시작)
    public void clearHistory(Long userId) {
        sessionHistories.remove(userId);
        System.out.println("User " + userId + "의 대화 히스토리 초기화");
    }
    
    private JsonObject callGeminiWithTools(List<Map<String, Object>> history, Long userId) {
        JsonObject requestBody = new JsonObject();
        
        // 대화 내용
        requestBody.add("contents", gson.toJsonTree(history));
        
        // MCP Tools 추가
        JsonArray tools = new JsonArray();
        JsonObject toolsWrapper = new JsonObject();
        JsonArray functionDeclarations = new JsonArray();
        
        for (MCPTool tool : mcpService.getAvailableTools()) {
            JsonObject func = new JsonObject();
            func.addProperty("name", tool.getName());
            func.addProperty("description", tool.getDescription());
            func.add("parameters", gson.toJsonTree(tool.getParameters()));
            functionDeclarations.add(func);
        }
        
        toolsWrapper.add("functionDeclarations", functionDeclarations);
        tools.add(toolsWrapper);
        requestBody.add("tools", tools);
        
        // 시스템 프롬프트
        JsonObject systemInstruction = new JsonObject();
        JsonArray parts = new JsonArray();
        JsonObject textPart = new JsonObject();
        textPart.addProperty("text", String.format(
            "당신은 기차 예매 도우미입니다. 사용자 ID %d의 요청을 처리하세요. " +
            "사용 가능한 도구: search_trains(기차 검색), book_train(예매), " +
            "get_my_bookings(예매 내역), cancel_booking(취소). " +
            "도구를 적극 활용하여 실제 데이터를 조회하세요.", userId
        ));
        parts.add(textPart);
        systemInstruction.add("parts", parts);
        requestBody.add("systemInstruction", systemInstruction);
        
        System.out.println("도구 개수: " + functionDeclarations.size());
        
        String url = String.format("/models/gemini-2.5-flash:generateContent?key=%s", apiKey);
        
        String responseStr = webClient.post()
            .uri(url)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(gson.toJson(requestBody))
            .retrieve()
            .bodyToMono(String.class)
            .block();
        
        return gson.fromJson(responseStr, JsonObject.class);
    }
    
    private String processGeminiResponse(JsonObject response, 
                                        List<Map<String, Object>> history, 
                                        Long userId) {
        if (!response.has("candidates") || response.getAsJsonArray("candidates").isEmpty()) {
            return "응답 없음";
        }
        
        JsonObject candidate = response.getAsJsonArray("candidates").get(0).getAsJsonObject();
        JsonObject content = candidate.getAsJsonObject("content");
        JsonArray parts = content.getAsJsonArray("parts");
        
        if (parts.isEmpty()) return "응답 비어있음";
        
        JsonObject firstPart = parts.get(0).getAsJsonObject();
        
        // Function Call 체크
        if (firstPart.has("functionCall")) {
            System.out.println("=== Function Call 감지 ===");
            return handleFunctionCall(firstPart, history, userId);
        }
        
        // 일반 텍스트
        if (firstPart.has("text")) {
            return firstPart.get("text").getAsString();
        }
        
        return "응답 파싱 실패";
    }
    
    private String handleFunctionCall(JsonObject functionCallPart, 
                                     List<Map<String, Object>> history,
                                     Long userId) {
        JsonObject functionCall = functionCallPart.getAsJsonObject("functionCall");
        String functionName = functionCall.get("name").getAsString();
        JsonObject args = functionCall.has("args") ? 
            functionCall.getAsJsonObject("args") : new JsonObject();
        
        System.out.println("함수: " + functionName);
        System.out.println("인자: " + args);
        
        @SuppressWarnings("unchecked")
        Map<String, Object> argsMap = gson.fromJson(args, Map.class);
        
        // userId 자동 주입
        if (functionName.equals("book_train") || 
            functionName.equals("get_my_bookings") || 
            functionName.equals("cancel_booking")) {
            argsMap.put("userId", userId.doubleValue());
        }
        
        String toolResult = mcpService.executeTool(functionName, argsMap);
        System.out.println("결과: " + toolResult);
        
        // Function Response 추가
        history.add(Map.of(
            "role", "model",
            "parts", List.of(Map.of("functionCall", Map.of(
                "name", functionName,
                "args", argsMap
            )))
        ));
        
        history.add(Map.of(
            "role", "function",
            "parts", List.of(Map.of(
                "functionResponse", Map.of(
                    "name", functionName,
                    "response", Map.of("content", toolResult)
                )
            ))
        ));
        
        // 최종 응답 받기
        JsonObject finalResponse = callGeminiWithTools(history, userId);
        return processGeminiResponse(finalResponse, history, userId);
    }
}
