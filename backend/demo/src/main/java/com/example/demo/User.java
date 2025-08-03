package com.example.demo.user;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "users") // 실제 테이블 이름을 'users'로 지정 (user는 예약어인 경우가 많음)
@Getter
@NoArgsConstructor
public class User {
    @Id
    private Long id; // 예시를 위해 GeneratedValue 생략
    private String name;

    public User(Long id, String name) {
        this.id = id;
        this.name = name;
    }
}