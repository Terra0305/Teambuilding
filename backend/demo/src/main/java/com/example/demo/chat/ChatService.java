package com.example.demo.chat;

import com.example.demo.train.Train;
import com.example.demo.train.TrainService;
import com.example.demo.user.User;
import com.example.demo.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
@Transactional
public class ChatService {

    private final ChatRoomRepository chatRoomRepository;
    private final TrainService trainService; // 기차 검색을 위해 추가

    public ChatMessage processUserMessage(String messageContent, User user) {
        // 1. 사용자의 채팅방 찾기 (없으면 새로 생성)
        ChatRoom chatRoom = chatRoomRepository.findByUserId(user.getId())
                .orElseGet(() -> new ChatRoom(user));

        // 2. 사용자 메시지 저장
        ChatMessage userMessage = new ChatMessage(chatRoom, ChatMessage.MessageSender.USER, messageContent);
        chatRoom.addMessage(userMessage);
        chatRoomRepository.save(chatRoom); // chatRoom을 저장하여 userMessage도 함께 저장 (cascade)

        // 3. 사용자 메시지 분석 및 봇 응답 생성
        String botResponseContent = generateBotResponse(messageContent);

        // 4. 봇 메시지 저장
        ChatMessage botMessage = new ChatMessage(chatRoom, ChatMessage.MessageSender.BOT, botResponseContent);
        chatRoom.addMessage(botMessage);
        chatRoomRepository.save(chatRoom);

        return botMessage;
    }

    private String generateBotResponse(String userMessage) {
        // 간단한 패턴 매칭으로 기차 검색 의도 파악
        Pattern pattern = Pattern.compile("(?:(\\d+)\\s*월\\s*(\\d+)\\s*일)?.*?\\s*(\\S+)\\s*(?:에서|부터)\\s*(\\S+)\\s*(?:까지|가는|행)");
        Matcher matcher = pattern.matcher(userMessage);

        if (matcher.find()) {
            String month = matcher.group(1);
            String day = matcher.group(2);
            String origin = matcher.group(3).replace("역", "");
            String destination = matcher.group(4).replace("역", "");

            LocalDate searchDate;
            if (month != null && day != null) {
                int year = LocalDate.now().getYear();
                searchDate = LocalDate.of(year, Integer.parseInt(month), Integer.parseInt(day));
            } else {
                searchDate = LocalDate.now();
            }

            try {
                List<Train> trains = trainService.searchTrains(origin, destination, searchDate);
                if (trains.isEmpty()) {
                    return String.format("%s 출발, %s 도착하는 기차를 찾을 수 없습니다.", origin, destination);
                }

                StringBuilder response = new StringBuilder();
                response.append(String.format("[%s] %s -> %s 기차 조회 결과입니다:\n", searchDate, origin, destination));
                for (Train train : trains) {
                    response.append(String.format("- %s (%s 출발, %s 도착)\n",
                            train.getTrainNumber(), train.getDepartureTime(), train.getArrivalTime()));
                }
                return response.toString();

            } catch (Exception e) {
                return "기차 정보 조회 중 오류가 발생했습니다.";
            }
        } else {
            return "안녕하세요! 기차표 예매를 도와드릴게요. '서울에서 부산 가는 기차 찾아줘'와 같이 말씀해주세요.";
        }
    }
}
