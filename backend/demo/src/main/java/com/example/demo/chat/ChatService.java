package com.example.demo.chat;

import com.example.demo.train.Train;
import com.example.demo.train.TrainService;
import com.example.demo.user.User;
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
    private final TrainService trainService;

    public ChatMessage processUserMessage(String messageContent, User user) {
        // 1. 사용자의 채팅방 찾기 (없으면 새로 생성)
        ChatRoom chatRoom = chatRoomRepository.findByUserId(user.getId())
                .orElseGet(() -> new ChatRoom(user));

        // 2. 사용자 메시지 저장
        ChatMessage userMessage = new ChatMessage(chatRoom, ChatMessage.MessageSender.USER, messageContent);
        chatRoom.addMessage(userMessage);
        chatRoomRepository.save(chatRoom);

        // 3. 사용자 메시지 분석 및 봇 응답 생성 (상태 기반)
        String botResponseContent = generateBotResponse(messageContent, chatRoom);

        // 4. 봇 메시지 저장
        ChatMessage botMessage = new ChatMessage(chatRoom, ChatMessage.MessageSender.BOT, botResponseContent);
        chatRoom.addMessage(botMessage);
        chatRoomRepository.save(chatRoom);

        return botMessage;
    }

    private String generateBotResponse(String userMessage, ChatRoom chatRoom) {
        String currentState = chatRoom.getConversationState() == null ? "IDLE" : chatRoom.getConversationState();
        String lowerCaseMessage = userMessage.toLowerCase();

        // 대화 상태와 관계없이 "취소" 키워드 처리
        if (lowerCaseMessage.contains("취소")) {
            resetConversation(chatRoom);
            return "알겠습니다. 진행하던 예매를 취소하고 처음으로 돌아갑니다. 무엇을 도와드릴까요?";
        }

        // 현재 대화 상태에 따라 분기
        switch (currentState) {
            case "ASKING_ORIGIN":
                return handleAskingOrigin(userMessage, chatRoom);
            case "ASKING_DESTINATION":
                return handleAskingDestination(userMessage, chatRoom);
            case "ASKING_DATE":
                return handleAskingDate(userMessage, chatRoom);
            default: // "IDLE" 상태
                return handleIdleState(userMessage, chatRoom);
        }
    }

    private String handleIdleState(String userMessage, ChatRoom chatRoom) {
        String lowerCaseMessage = userMessage.toLowerCase();

        // 간단한 인사 및 감사 처리
        if (lowerCaseMessage.contains("안녕") || lowerCaseMessage.contains("하이")) {
            return "안녕하세요! 기차 예매를 도와드릴까요?";
        }
        if (lowerCaseMessage.contains("고마워") || lowerCaseMessage.contains("땡큐")) {
            return "천만에요! 추가로 도움이 필요하시면 언제든지 말씀해주세요.";
        }

        // "서울에서 부산" 처럼 완전한 요청 파싱 시도
        Pattern fullPattern = Pattern.compile("(\\S+)\\s*(?:에서|부터)\\s*(\\S+)\\s*(?:까지|가는|행)");
        Matcher fullMatcher = fullPattern.matcher(userMessage);
        if (fullMatcher.find()) {
            String origin = fullMatcher.group(1).replace("역", "");
            String destination = fullMatcher.group(2).replace("역", "");
            chatRoom.setTempOrigin(origin);
            chatRoom.setTempDestination(destination);
            chatRoom.setConversationState("ASKING_DATE");
            return String.format("%s에서 %s까지, 맞으신가요? 날짜는 언제가 좋을까요? (예: 내일, 10월 26일)", origin, destination);
        }

        // "예매" 또는 "기차" 키워드만 있는 경우
        if (lowerCaseMessage.contains("예매") || lowerCaseMessage.contains("기차")) {
            chatRoom.setConversationState("ASKING_ORIGIN");
            return "네, 기차 예매를 도와드릴게요. 어디에서 출발하시나요?";
        }

        return "죄송합니다, 잘 이해하지 못했어요. '서울역에서 부산역 가는 기차'처럼 말씀해주시거나, '기차 예매'라고 말씀해주세요.";
    }

    private String handleAskingOrigin(String userMessage, ChatRoom chatRoom) {
        String origin = userMessage.replace("역", "");
        chatRoom.setTempOrigin(origin);
        chatRoom.setConversationState("ASKING_DESTINATION");
        return String.format("%s에서 출발, 맞으신가요? 어디로 도착하시나요?", origin);
    }

    private String handleAskingDestination(String userMessage, ChatRoom chatRoom) {
        String destination = userMessage.replace("역", "");
        chatRoom.setTempDestination(destination);
        chatRoom.setConversationState("ASKING_DATE");
        return String.format("%s 도착, 맞으신가요? 날짜는 언제가 좋을까요? (예: 내일, 10월 26일)", destination);
    }

    private String handleAskingDate(String userMessage, ChatRoom chatRoom) {
        LocalDate date = parseDate(userMessage);
        if (date == null) {
            return "날짜를 이해하지 못했어요. '내일', '10월 26일'과 같이 다시 말씀해주시겠어요?";
        }
        chatRoom.setTempDate(date.toString());

        String origin = chatRoom.getTempOrigin();
        String destination = chatRoom.getTempDestination();
        
        return searchAndFormatTrains(origin, destination, date, chatRoom);
    }

    private String searchAndFormatTrains(String origin, String destination, LocalDate date, ChatRoom chatRoom) {
        try {
            List<Train> trains = trainService.searchTrains(origin, destination, date);
            resetConversation(chatRoom); // 검색 후 상태 초기화

            if (trains.isEmpty()) {
                return String.format("%s 출발, %s 도착하는 %s 날짜의 기차를 찾을 수 없습니다.", origin, destination, date);
            }

            StringBuilder response = new StringBuilder();
            response.append(String.format("[%s] %s -> %s 기차 조회 결과입니다:%n", date, origin, destination));
            for (Train train : trains) {
                response.append(String.format("- %s (%s 출발, %s 도착)%n",
                        train.getTrainNumber(), train.getDepartureTime(), train.getArrivalTime()));
            }
            response.append(System.lineSeparator());
            response.append("예매를 원하시는 기차 번호를 알려주세요.");
            return response.toString();

        } catch (Exception e) {
            resetConversation(chatRoom); // 오류 발생 시에도 상태 초기화
            return "기차 정보 조회 중 오류가 발생했습니다. 다시 시도해주세요.";
        }
    }

    private LocalDate parseDate(String dateString) {
        String lowerCaseDate = dateString.toLowerCase();
        if (lowerCaseDate.contains("오늘")) {
            return LocalDate.now();
        } else if (lowerCaseDate.contains("내일")) {
            return LocalDate.now().plusDays(1);
        } else {
            Pattern pattern = Pattern.compile("(\\d+)\\s*월\\s*(\\d+)\\s*일");
            Matcher matcher = pattern.matcher(dateString);
            if (matcher.find()) {
                int month = Integer.parseInt(matcher.group(1));
                int day = Integer.parseInt(matcher.group(2));
                return LocalDate.of(LocalDate.now().getYear(), month, day);
            }
        }
        return null; // 파싱 실패
    }

    private void resetConversation(ChatRoom chatRoom) {
        chatRoom.setConversationState("IDLE");
        chatRoom.setTempOrigin(null);
        chatRoom.setTempDestination(null);
        chatRoom.setTempDate(null);
    }
}