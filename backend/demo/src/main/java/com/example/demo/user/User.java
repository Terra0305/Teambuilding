package com.example.demo.user;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "users")
@Getter
@NoArgsConstructor
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String username; // 로그인 ID

    @Column(nullable = false)
    private String password; // 암호화된 비밀번호

    @Column(nullable = false)
    private String name; // 실제 이름

    @Column(nullable = false)
    private String role = "USER"; // 사용자 권한

    // UserController가 필요로 하는 생성자
    public User(String username, String password, String name) {
        this.username = username;
        this.password = password;
        this.name = name;
    }
}