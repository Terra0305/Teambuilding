package com.example.demo.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

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

    @GetMapping("/login-success")
    public String loginSuccessPage() {
        return "login-success";
    }
    
    @GetMapping("/")
    public String index() {
        return "home";
    }
}
