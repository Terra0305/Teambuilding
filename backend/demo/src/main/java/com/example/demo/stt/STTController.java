package com.example.demo.stt;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/stt")
@RequiredArgsConstructor
public class STTController {

    private final STTService sttService;

    @PostMapping("/transcribe")
    public ResponseEntity<?> transcribe(@RequestParam("audio") MultipartFile audioFile) {
        try {
            String transcript = sttService.transcribe(audioFile);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "transcript", transcript));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of(
                    "success", false,
                    "message", "STT 오류: " + e.getMessage()));
        }
    }
}
