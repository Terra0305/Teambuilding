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

    public ChatRoom(User user) {
        this.user = user;
        this.createdAt = LocalDateTime.now();
    }

    public void addMessage(ChatMessage message) {
        messages.add(message);
        message.setChatRoom(this);
    }
}
