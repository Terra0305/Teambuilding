package com.example.demo.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;

@Controller
public class WebController {

    // --- Real Site ---
    @GetMapping("/")
    public String index() {
        return "snt_home";
    }

    @GetMapping("/login")
    public String sntLoginPage() {
        return "snt_login";
    }

    @GetMapping("/signup")
    public String sntSignupPage() {
        return "snt_signup";
    }

    @GetMapping("/train-reserve")
    public String sntTrainReservePage() {
        return "snt_trainReserve";
    }

    // --- Dummy Site ---
    @GetMapping("/dummy")
    public String dummyHomePage() {
        return "home"; // /dummy 경로에서 기존 home.html을 보여줌
    }

    @GetMapping("/dummy/signup")
    public String dummySignupPage() {
        return "signup";
    }
    
    @GetMapping("/dummy/login")
    public String dummyLoginPage() {
        return "login";
    }

    @GetMapping("/dummy/mypage")
    public String dummyMypage() {
        return "mypage";
    }

    @GetMapping("/dummy/login-success")
    public String dummyLoginSuccessPage(Authentication authentication, Model model) {
        if (authentication != null && authentication.isAuthenticated()) {
            String username = authentication.getName();
            model.addAttribute("username", username);
        }
        return "redirect:/dummy"; // Redirect to the dummy home page
    }
}