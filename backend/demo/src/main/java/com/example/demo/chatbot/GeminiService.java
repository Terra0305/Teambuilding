package com.example.demo.chatbot;

import com.example.demo.chatbot.mcp.MCPService;
import com.example.demo.chatbot.mcp.MCPTool;
import com.example.demo.user.User;
import com.example.demo.user.UserRepository;
import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GeminiService {

    @Value("${gemini.api.key}")
    private String apiKey;

    private final MCPService mcpService;
    private final ChatMessageRepository chatMessageRepository;
    private final UserRepository userRepository;
    private final Gson gson = new Gson();

    private final WebClient webClient = WebClient.builder()
            .baseUrl("https://generativelanguage.googleapis.com/v1beta")
            .build();

    @Transactional
    public String chat(String userMessage, Long userId) {
        try {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new IllegalArgumentException("User not found"));

            // DB에서 대화 내역 로드
            List<ChatMessage> dbHistory = chatMessageRepository.findByUserIdOrderByCreatedAtAsc(userId);
            List<Map<String, Object>> conversationHistory = dbHistory.stream()
                    .map(msg -> gson.<Map<String, Object>>fromJson(msg.getContent(), Map.class))
                    .collect(Collectors.toCollection(ArrayList::new));

            // 새 사용자 메시지 추가 및 DB 저장
            Map<String, Object> userMessageMap = Map.of(
                    "role", "user",
                    "parts", List.of(Map.of("text", userMessage)));
            conversationHistory.add(userMessageMap);
            chatMessageRepository.save(new ChatMessage(user, "user", gson.toJson(userMessageMap)));

            JsonObject response = callGeminiWithTools(conversationHistory, userId);
            return processGeminiResponse(response, conversationHistory, user, userId);

        } catch (WebClientResponseException e) {
            System.err.println("API 오류: " + e.getStatusCode());
            System.err.println("응답: " + e.getResponseBodyAsString());
            return "AI 서버 오류: " + e.getStatusCode();
        } catch (Exception e) {
            e.printStackTrace();
            return "오류: " + e.getMessage();
        }
    }

    @Transactional
    public void clearHistory(Long userId) {
        chatMessageRepository.deleteByUserId(userId);
        System.out.println("User " + userId + "의 대화 히스토리 초기화");
    }

    public List<ChatMessage> getChatHistory(Long userId) {
        return chatMessageRepository.findByUserIdOrderByCreatedAtAsc(userId);
    }

    private JsonObject callGeminiWithTools(List<Map<String, Object>> history, Long userId) {
        JsonObject requestBody = new JsonObject();
        requestBody.add("contents", gson.toJsonTree(history));

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

        JsonObject systemInstruction = new JsonObject();
        JsonArray parts = new JsonArray();
        JsonObject textPart = new JsonObject();
        // 현재 날짜 가져오기
        LocalDate today = LocalDate.now();
        LocalDate tomorrow = today.plusDays(1);
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        String todayStr = today.format(formatter);
        String tomorrowStr = tomorrow.format(formatter);

        textPart.addProperty("text",
                "You are a train booking assistant. Current date: " + todayStr + "\n\n" +
                        "User ID: " + userId + "\n\n" +
                        "CRITICAL INSTRUCTIONS:\n" +
                        "1. ALWAYS use tools to get real data. NEVER make assumptions or ask clarifying questions when you can use tools.\n"
                        +
                        "2. When user mentions dates in Korean (like '10월27일'), convert to YYYY-MM-DD format ("
                        + todayStr + ")\n" +
                        "3. Common Korean dates:\n" +
                        "   - '오늘', 'today' → " + todayStr + "\n" +
                        "   - '10월27일', '10/27' → " + todayStr + "\n" +
                        "   - '내일', 'tomorrow' → " + tomorrowStr + "\n\n" +
                        "Available destinations: 용산, 광주송정, 서울, 부산, 대전, 대구\n" +
                        "- If user says '광주', assume '광주송정'\n\n" +
                        "Available tools:\n" +
                        "1. search_trains(origin, destination, date) - Search trains. Date must be YYYY-MM-DD format\n"
                        +
                        "2. book_train(trainId) - Book a train\n" +
                        "3. get_my_bookings() - Get user bookings\n" +
                        "4. cancel_booking(bookingId) - Cancel booking\n\n" +
                        "WORKFLOW when user asks to search/book:\n" +
                        "1. Extract: origin, destination, date from user message\n" +
                        "2. Convert date to YYYY-MM-DD\n" +
                        "3. USE search_trains tool immediately\n" +
                        "4. Present results in Korean\n\n" +
                        "⭐ IMPORTANT: When presenting search results:\n" +
                        "- If there is ONLY 1 train result: Present it and ask '이 기차를 예매하시겠습니까?' (YES/NO question)\n" +
                        "- If there are MULTIPLE trains: Present all results and ask '어떤 기차를 예매하시겠어요? (기차 번호 또는 출발 시간을 알려주세요)'\n"
                        +
                        "- DO NOT ask which train to book when there is only one option!\n\n" +
                        "Example 1 (Only 1 train):\n" +
                        "User: '10월11일 용산에서 광주가는 기차표 예매해줘'\n" +
                        "→ Call search_trains(origin='용산', destination='광주송정', date='2025-10-11')\n" +
                        "→ If only 1 result: '10월 11일 광주송정에서 용산으로 가는 기차는 다음과 같습니다:\n\n" +
                        "   * KTX 1011_2 (ID: 568): 광주송정 14:00 출발, 용산 16:30 도착, 가격 50000원\n\n" +
                        "   이 기차를 예매하시겠습니까?'\n\n" +
                        "Example 2 (Multiple trains):\n" +
                        "→ If 2+ results: Present all and ask '어떤 기차를 예매하시겠어요?'");
        parts.add(textPart);
        systemInstruction.add("parts", parts);
        requestBody.add("systemInstruction", systemInstruction);

        String url = String.format("/models/gemini-2.5-flash-lite:generateContent?key=%s", apiKey);

        String responseStr = webClient.post()
                .uri(url)
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(gson.toJson(requestBody))
                .retrieve()
                .bodyToMono(String.class)
                .block();

        return gson.fromJson(responseStr, JsonObject.class);
    }

    @Transactional
    private String processGeminiResponse(JsonObject response, List<Map<String, Object>> history, User user,
            Long userId) {
        if (!response.has("candidates") || response.getAsJsonArray("candidates").isEmpty()) {
            return "응답 없음";
        }

        JsonObject candidate = response.getAsJsonArray("candidates").get(0).getAsJsonObject();
        JsonObject content = candidate.getAsJsonObject("content");

        // 모델 응답 저장
        chatMessageRepository.save(new ChatMessage(user, "model", gson.toJson(content)));

        JsonArray parts = content.getAsJsonArray("parts");
        if (parts.isEmpty())
            return "응답 비어있음";

        JsonObject firstPart = parts.get(0).getAsJsonObject();

        if (firstPart.has("functionCall")) {
            return handleFunctionCall(firstPart, history, user, userId);
        }

        if (firstPart.has("text")) {
            return firstPart.get("text").getAsString();
        }

        return "응답 파싱 실패";
    }

    @Transactional
    private String handleFunctionCall(JsonObject functionCallPart, List<Map<String, Object>> history, User user,
            Long userId) {
        JsonObject functionCall = functionCallPart.getAsJsonObject("functionCall");
        String functionName = functionCall.get("name").getAsString();
        JsonObject args = functionCall.has("args") ? functionCall.getAsJsonObject("args") : new JsonObject();

        @SuppressWarnings("unchecked")
        Map<String, Object> argsMap = gson.fromJson(args, Map.class);

        if (functionName.equals("book_train") || functionName.equals("get_my_bookings")
                || functionName.equals("cancel_booking")) {
            argsMap.put("userId", userId.doubleValue());
        }

        String toolResult = mcpService.executeTool(functionName, argsMap);

        // Function Response를 history에 추가하고 DB에 저장
        Map<String, Object> functionResponseMap = Map.of(
                "role", "function",
                "parts", List.of(Map.of(
                        "functionResponse", Map.of(
                                "name", functionName,
                                "response", Map.of("content", toolResult)))));
        history.add(functionResponseMap);
        chatMessageRepository.save(new ChatMessage(user, "function", gson.toJson(functionResponseMap)));

        JsonObject finalResponse = callGeminiWithTools(history, userId);
        return processGeminiResponse(finalResponse, history, user, userId);
    }
}
