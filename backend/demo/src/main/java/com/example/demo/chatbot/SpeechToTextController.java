package com.example.demo.chatbot;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import reactor.core.publisher.Mono;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class SpeechToTextController {

    private final GoogleSttService googleSttService; // Changed from HuggingFaceService

    @PostMapping("/speech-to-text")
    public Mono<ResponseEntity<Map<String, String>>> speechToText(@RequestParam("audio") MultipartFile audioFile) {
        try {
            byte[] audioData = audioFile.getBytes();
            return googleSttService.transcribe(audioData)
                    .map(transcribedText -> ResponseEntity.ok(Map.of("text", transcribedText)))
                    .onErrorResume(e -> {
                        System.err.println("Speech-to-text error: " + e.getMessage());
                        // Log the response body if it's a WebClientResponseException
                        if (e instanceof org.springframework.web.reactive.function.client.WebClientResponseException) {
                            org.springframework.web.reactive.function.client.WebClientResponseException ex = (org.springframework.web.reactive.function.client.WebClientResponseException) e;
                            System.err.println("Error Response Body: " + ex.getResponseBodyAsString());
                        }
                        return Mono.just(ResponseEntity.status(500).body(Map.of("error", "Error during transcription.")));
                    });
        } catch (IOException e) {
            System.err.println("Error reading audio file: " + e.getMessage());
            return Mono.just(ResponseEntity.status(400).body(Map.of("error", "Invalid audio file.")));
        }
    }
}
