package com.example.demo.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;

@Controller
public class WebController {

    // SPA 라우팅 처리: 모든 페이지 요청을 React의 index.html로 포워딩
    @GetMapping(value = {
            "/",
            "/login",
            "/register",
            "/trainbooking/**",
            "/busbooking/**",
            "/check",
            "/payment/**",
            "/mypage",
            "/chatbot",
            "/voice-reserve"
    })
    public String forwardToReact() {
        return "forward:/index.html";
    }
}
