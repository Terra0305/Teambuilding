package com.example.demo.user.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SignupRequest {
    private String username;
    private String password;
    private String passwordConfirm;
    private String name; // 사용자 이름 필드 추가
}