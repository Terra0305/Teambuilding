package com.example.demo.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;

@RestController
@RequestMapping("/api")
public class SecureController {

    @GetMapping("/secure")
    public String secureEndpoint(Principal principal) {
        return "🔐 Hello, " + principal.getName() + "! You are authenticated.";
    }
}
