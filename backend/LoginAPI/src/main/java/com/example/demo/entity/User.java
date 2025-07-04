package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity                 // JPA 엔티티임을 명시
@Table(name = "users")  // 테이블명. 생략하면 클래스명과 동일
@Data                   // Lombok: getter/setter 등 자동 생성
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // AUTO_INCREMENT
    private Long id;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false)
    private String password;
}
