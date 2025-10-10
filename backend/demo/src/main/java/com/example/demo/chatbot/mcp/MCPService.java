package com.example.demo.chatbot.mcp;

import com.example.demo.booking.BookingService;
import com.example.demo.booking.dto.BookingResponseDto;
import com.example.demo.train.Train;
import com.example.demo.train.TrainService;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonSerializer;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MCPService {
    
    private final TrainService trainService;
    private final BookingService bookingService;
    
    // LocalDateTime을 처리할 수 있는 Gson
    private final Gson gson = new GsonBuilder()
        .registerTypeAdapter(LocalDateTime.class, 
            (JsonSerializer<LocalDateTime>) (src, typeOfSrc, context) -> 
                context.serialize(src.format(DateTimeFormatter.ISO_LOCAL_DATE_TIME)))
        .create();
    
    public String executeTool(String toolName, Map<String, Object> arguments) {
        try {
            System.out.println("=== MCP Tool 실행 ===");
            System.out.println("도구: " + toolName);
            System.out.println("인자: " + arguments);
            
            String result = switch (toolName) {
                case "search_trains" -> searchTrains(arguments);
                case "book_train" -> bookTrain(arguments);
                case "get_my_bookings" -> getMyBookings(arguments);
                case "cancel_booking" -> cancelBooking(arguments);
                default -> gson.toJson(Map.of(
                    "error", "알 수 없는 도구입니다: " + toolName
                ));
            };
            
            System.out.println("실행 결과: " + result);
            return result;
            
        } catch (Exception e) {
            e.printStackTrace();
            return gson.toJson(Map.of(
                "error", e.getMessage(),
                "type", e.getClass().getSimpleName()
            ));
        }
    }
    
    private String searchTrains(Map<String, Object> args) {
        try {
            String origin = (String) args.get("origin");
            String destination = (String) args.get("destination");
            String dateStr = (String) args.get("date");
            
            if (origin == null || destination == null || dateStr == null) {
                return gson.toJson(Map.of(
                    "error", "출발지, 도착지, 날짜는 필수입니다"
                ));
            }
            
            LocalDate date = LocalDate.parse(dateStr);
            List<Train> trains = trainService.searchTrains(origin, destination, date);
            
            if (trains.isEmpty()) {
                return gson.toJson(Map.of(
                    "message", "검색 결과가 없습니다",
                    "trains", List.of()
                ));
            }
            
            // Train 객체를 간단한 Map으로 변환 (LocalDateTime 문제 회피)
            List<Map<String, Object>> trainMaps = trains.stream()
                .limit(10) // 최대 10개만
                .map(train -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("id", train.getId());
                    map.put("trainNumber", train.getTrainNumber());
                    map.put("origin", train.getOrigin());
                    map.put("destination", train.getDestination());
                    map.put("departureTime", train.getDepartureTime().format(DateTimeFormatter.ofPattern("HH:mm")));
                    map.put("arrivalTime", train.getArrivalTime().format(DateTimeFormatter.ofPattern("HH:mm")));
                    map.put("price", train.getPrice());
                    return map;
                })
                .collect(Collectors.toList());
            
            return gson.toJson(Map.of(
                "message", trains.size() + "개의 기차를 찾았습니다",
                "count", trains.size(),
                "trains", trainMaps
            ));
            
        } catch (Exception e) {
            e.printStackTrace();
            return gson.toJson(Map.of(
                "error", "기차 검색 중 오류: " + e.getMessage()
            ));
        }
    }
    
    private String bookTrain(Map<String, Object> args) {
        try {
            Long userId = toLong(args.get("userId"));
            Long trainId = toLong(args.get("trainId"));
            
            if (userId == null || trainId == null) {
                return gson.toJson(Map.of(
                    "error", "userId와 trainId는 필수입니다",
                    "received_userId", args.get("userId"),
                    "received_trainId", args.get("trainId")
                ));
            }
            
            bookingService.bookTrain(userId, trainId);
            
            return gson.toJson(Map.of(
                "success", true,
                "message", "예매가 완료되었습니다",
                "userId", userId,
                "trainId", trainId
            ));
            
        } catch (IllegalArgumentException e) {
            return gson.toJson(Map.of(
                "error", e.getMessage()
            ));
        } catch (Exception e) {
            e.printStackTrace();
            return gson.toJson(Map.of(
                "error", "예매 중 오류: " + e.getMessage()
            ));
        }
    }
    
    private String getMyBookings(Map<String, Object> args) {
        try {
            Long userId = toLong(args.get("userId"));
            
            if (userId == null) {
                return gson.toJson(Map.of(
                    "error", "userId는 필수입니다"
                ));
            }
            
            List<BookingResponseDto> bookings = bookingService.findBookingsByUserId(userId);
            
            // BookingResponseDto를 간단한 Map으로 변환
            List<Map<String, Object>> bookingMaps = bookings.stream()
                .map(booking -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("bookingId", booking.getBookingId());
                    map.put("trainNumber", booking.getTrainNumber());
                    map.put("origin", booking.getOrigin());
                    map.put("destination", booking.getDestination());
                    map.put("departureTime", booking.getDepartureTime().format(
                        DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")));
                    map.put("arrivalTime", booking.getArrivalTime().format(
                        DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")));
                    map.put("price", booking.getPrice());
                    map.put("status", booking.getStatus());
                    return map;
                })
                .collect(Collectors.toList());
            
            return gson.toJson(Map.of(
                "message", bookings.size() + "개의 예매 내역이 있습니다",
                "count", bookings.size(),
                "bookings", bookingMaps
            ));
            
        } catch (Exception e) {
            e.printStackTrace();
            return gson.toJson(Map.of(
                "error", "예매 조회 중 오류: " + e.getMessage()
            ));
        }
    }
    
    private String cancelBooking(Map<String, Object> args) {
        try {
            Long bookingId = toLong(args.get("bookingId"));
            Long userId = toLong(args.get("userId"));
            
            if (bookingId == null || userId == null) {
                return gson.toJson(Map.of(
                    "error", "bookingId와 userId는 필수입니다"
                ));
            }
            
            bookingService.cancelBooking(bookingId, userId);
            
            return gson.toJson(Map.of(
                "success", true,
                "message", "예매가 취소되었습니다",
                "bookingId", bookingId
            ));
            
        } catch (IllegalArgumentException e) {
            return gson.toJson(Map.of(
                "error", e.getMessage()
            ));
        } catch (Exception e) {
            e.printStackTrace();
            return gson.toJson(Map.of(
                "error", "예매 취소 중 오류: " + e.getMessage()
            ));
        }
    }
    
    private Long toLong(Object value) {
        if (value == null) {
            return null;
        }
        if (value instanceof Number) {
            return ((Number) value).longValue();
        }
        if (value instanceof String) {
            try {
                return Long.parseLong((String) value);
            } catch (NumberFormatException e) {
                System.err.println("Long 변환 실패: " + value);
                return null;
            }
        }
        System.err.println("알 수 없는 타입: " + value.getClass().getName());
        return null;
    }
    
    public List<MCPTool> getAvailableTools() {
        return List.of(
            MCPTool.searchTrains(),
            MCPTool.bookTrain(),
            MCPTool.getMyBookings(),
            MCPTool.cancelBooking()
        );
    }
}
