package com.example.demo.chatbot;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import com.google.gson.Gson;
import com.google.gson.JsonObject;

import java.util.Base64;

@Service
public class GoogleSttService {

    @Value("${gemini.api.key}") // Google STT uses the same API key as Gemini
    private String apiKey;

    private final WebClient webClient;
    private final Gson gson = new Gson();

    private static final String API_URL = "https://speech.googleapis.com/v1/speech:recognize";

    public GoogleSttService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.baseUrl(API_URL).build();

    }

    public Mono<String> transcribe(byte[] audioData) {
        System.out.println("Using Google STT API Key: " + apiKey); // DEBUG LOG

        // Base64 encode the audio data
        String encodedAudio = Base64.getEncoder().encodeToString(audioData);

        // Construct the request body for Google STT
        JsonObject requestBody = new JsonObject();
        JsonObject config = new JsonObject();
        config.addProperty("encoding", "WEBM_OPUS");
        config.addProperty("sampleRateHertz", 48000); // Common sample rate for webm
        config.addProperty("languageCode", "ko-KR");
        
        JsonObject audio = new JsonObject();
        audio.addProperty("content", encodedAudio);

        requestBody.add("config", config);
        requestBody.add("audio", audio);

        return webClient.post()
                .uri(uriBuilder -> uriBuilder.queryParam("key", apiKey).build())
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(gson.toJson(requestBody))
                .retrieve()
                .bodyToMono(String.class)
                .map(this::parseResponse);
    }

    private String parseResponse(String jsonResponse) {
        JsonObject responseJson = gson.fromJson(jsonResponse, JsonObject.class);
        if (responseJson != null && responseJson.has("results")) {
            // Get the first result's first alternative's transcript
            return responseJson.getAsJsonArray("results")
                    .get(0).getAsJsonObject()
                    .getAsJsonArray("alternatives")
                    .get(0).getAsJsonObject()
                    .get("transcript").getAsString();
        }
        return "";
    }
}
