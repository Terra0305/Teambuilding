package com.example.demo.chatbot.mcp;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MCPTool {
    private String name;
    private String description;
    private Map<String, Object> parameters;
    
    public static MCPTool searchTrains() {
        return new MCPTool(
            "search_trains",
            "특정 날짜의 출발지에서 도착지로 가는 기차를 검색합니다",
            Map.of(
                "type", "object",
                "properties", Map.of(
                    "origin", Map.of(
                        "type", "string",
                        "description", "출발지 (예: 용산, 서울, 부산)"
                    ),
                    "destination", Map.of(
                        "type", "string",
                        "description", "도착지 (예: 광주송정, 대전, 동대구)"
                    ),
                    "date", Map.of(
                        "type", "string",
                        "description", "날짜 (YYYY-MM-DD 형식, 예: 2025-08-03)"
                    )
                ),
                "required", new String[]{"origin", "destination", "date"}
            )
        );
    }
    
    public static MCPTool bookTrain() {
        return new MCPTool(
            "book_train",
            "선택한 기차를 예매합니다. 사용자가 로그인되어 있어야 합니다",
            Map.of(
                "type", "object",
                "properties", Map.of(
                    "trainId", Map.of(
                        "type", "integer",
                        "description", "예매할 기차의 ID"
                    ),
                    "userId", Map.of(
                        "type", "integer",
                        "description", "예매하는 사용자의 ID"
                    )
                ),
                "required", new String[]{"trainId", "userId"}
            )
        );
    }
    
    public static MCPTool getMyBookings() {
        return new MCPTool(
            "get_my_bookings",
            "현재 사용자의 예매 목록을 조회합니다",
            Map.of(
                "type", "object",
                "properties", Map.of(
                    "userId", Map.of(
                        "type", "integer",
                        "description", "조회할 사용자의 ID"
                    )
                ),
                "required", new String[]{"userId"}
            )
        );
    }
    
    public static MCPTool cancelBooking() {
        return new MCPTool(
            "cancel_booking",
            "예매를 취소합니다",
            Map.of(
                "type", "object",
                "properties", Map.of(
                    "bookingId", Map.of(
                        "type", "integer",
                        "description", "취소할 예매의 ID"
                    ),
                    "userId", Map.of(
                        "type", "integer",
                        "description", "예매를 취소하는 사용자의 ID"
                    )
                ),
                "required", new String[]{"bookingId", "userId"}
            )
        );
    }
}
