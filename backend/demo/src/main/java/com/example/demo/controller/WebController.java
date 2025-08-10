package com.example.demo.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;

@Controller
public class WebController {

    @GetMapping("/signup")
    public String signupPage() {
        return "signup";
    }
    
    @GetMapping("/login")
    public String loginPage() {
        return "login";
    }

    @GetMapping("/home")
    public String homePage() {
        return "home";
    }

    @GetMapping("/mypage")
    public String mypage() {
        return "mypage";
    }

    // ★★★ 이 부분을 수정! ★★★
    @GetMapping("/login-success")
    public String loginSuccessPage(Authentication authentication, Model model) {
        if (authentication != null && authentication.isAuthenticated()) {
            // JWT 기반이므로 authentication.getName()으로 username을 가져옵니다
            String username = authentication.getName();
            model.addAttribute("username", username);
        }
        return "redirect:/home";
    }

    @GetMapping("/")
    public String index() {
        return "home";
    }
}