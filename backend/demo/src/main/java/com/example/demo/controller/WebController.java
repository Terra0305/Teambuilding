package com.example.demo.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;

@Controller
public class WebController {

    // 메인 페이지
    @GetMapping("/")
    public String index() {
        return "redirect:/index.html";
    }

    // 로그인 페이지
    @GetMapping("/login")
    public String loginPage() {
        return "redirect:/login.html";
    }

    // 회원가입 페이지
    @GetMapping("/signup")
    public String signupPage() {
        return "redirect:/signup.html";
    }

    // 기차 예매 페이지
    @GetMapping("/train-reserve")
    public String trainReservePage() {
        return "redirect:/train-reserve.html";
    }

    // 기차 검색 페이지
    @GetMapping("/train-search")
    public String trainSearchPage() {
        return "redirect:/train-search.html";
    }

    // 마이페이지
    @GetMapping("/mypage")
    public String mypage() {
        return "redirect:/mypage.html";
    }

    // 챗봇 페이지
    @GetMapping("/chatbot")
    public String chatbotPage() {
        return "redirect:/chatbot.html";
    }

    // 음성인식 페이지
    @GetMapping("/voice-reserve")
    public String voiceReservePage() {
        return "redirect:/voice-reserve.html";
    }

    // 로그인 성공 (JWT는 클라이언트에서 처리)
    @GetMapping("/login-success")
    public String loginSuccessPage() {
        return "redirect:/";
    }
}
