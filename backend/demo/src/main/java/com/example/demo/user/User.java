package com.example.demo.user;

import jakarta.persistence.*; // jakarta.persistence.* 임포트
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "users")
@Getter
@NoArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // ★★★ 이 줄을 추가하세요!
    private Long id;
    private String name;

    // 데이터를 생성할 때는 ID를 직접 넣지 않으므로, 이 생성자를 사용합니다.
    public User(String name) {
        this.name = name;
    }
}