package com.example.demo.chat;

import com.example.demo.user.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class ChatRoom {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @OneToMany(mappedBy = "chatRoom", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<ChatMessage> messages = new ArrayList<>();

    private LocalDateTime createdAt;

    // 대화 상태 저장을 위한 필드 추가
    @Column(name = "conversation_state")
    private String conversationState = "IDLE"; // 대화 상태 (IDLE, ASKING_DESTINATION, ASKING_DATE 등)

    @Column(name = "temp_origin")
    private String tempOrigin; // 임시 저장 출발지

    @Column(name = "temp_destination")
    private String tempDestination; // 임시 저장 도착지

    @Column(name = "temp_date")
    private String tempDate; // 임시 저장 날짜

    public ChatRoom(User user) {
        this.user = user;
        this.createdAt = LocalDateTime.now();
    }

    public void addMessage(ChatMessage message) {
        messages.add(message);
        message.setChatRoom(this);
    }
}
