package com.example.demo.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
public class WebController {

    @GetMapping("/home")
    public String home() {
        return "home";
    }
    
    @GetMapping("/")
    public String index() {
        return "home";
    }
}
