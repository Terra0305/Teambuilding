package com.example.demo.chat;

import com.example.demo.security.UserDetailsImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;
    private final ChatRoomRepository chatRoomRepository;

    // 사용자가 새 메시지를 보냈을 때
    @PostMapping("/message")
    public ResponseEntity<ChatMessageDto> postMessage(@RequestBody MessageRequest request,
                                                    @AuthenticationPrincipal UserDetailsImpl userDetails) {
        if (userDetails == null) {
            // 로그인하지 않은 사용자는 401 Unauthorized 응답
            return ResponseEntity.status(401).build();
        }

        ChatMessage botResponse = chatService.processUserMessage(request.content(), userDetails.getUser());
        return ResponseEntity.ok(new ChatMessageDto(botResponse));
    }

    // 특정 사용자의 채팅 기록 불러오기
    @GetMapping("/history")
    public ResponseEntity<List<ChatMessageDto>> getChatHistory(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }

        List<ChatMessageDto> history = chatRoomRepository.findByUserId(userDetails.getUser().getId())
                .map(ChatRoom::getMessages)
                .orElse(List.of())
                .stream()
                .map(ChatMessageDto::new)
                .toList();

        return ResponseEntity.ok(history);
    }
}

// --- DTOs ---

// 요청 DTO
record MessageRequest(String content) {}

// 응답 DTO
record ChatMessageDto(Long id, ChatMessage.MessageSender sender, String content, String timestamp) {
    public ChatMessageDto(ChatMessage message) {
        this(message.getId(), message.getSender(), message.getContent(), message.getTimestamp().toString());
    }
}
