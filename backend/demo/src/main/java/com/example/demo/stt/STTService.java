package com.example.demo.stt;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.reactive.function.client.WebClient;

import java.io.IOException;
import java.util.Base64;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class STTService {

    @Value("${google.cloud.stt.api.key}")
    private String apiKey;

    private final WebClient webClient = WebClient.builder()
            .baseUrl("https://speech.googleapis.com/v1")
            .build();

    private final Gson gson = new Gson();

    @jakarta.annotation.PostConstruct
    public void init() {
        System.out.println("==================================================");
        System.out.println("STT Service Initialized");
        System.out.println("API Key Loaded: " + (apiKey != null && !apiKey.isEmpty()));
        if (apiKey != null && apiKey.length() > 10) {
            System.out.println(
                    "API Key (Masked): " + apiKey.substring(0, 5) + "..." + apiKey.substring(apiKey.length() - 5));
        } else {
            System.out.println("API Key: " + apiKey);
        }
        System.out.println("Target URL: https://speech.googleapis.com/v1/speech:recognize");
        System.out.println("==================================================");
    }

    public String transcribe(MultipartFile audioFile) throws IOException {
        try {
            // Audio Content를 Base64로 인코딩
            String audioContent = Base64.getEncoder().encodeToString(audioFile.getBytes());

            // Request Body 생성
            JsonObject requestBody = new JsonObject();

            JsonObject config = new JsonObject();
            config.addProperty("encoding", "WEBM_OPUS");
            // sampleRateHertz는 WebM 헤더에 포함되어 있으므로 생략하는 것이 안전함
            // config.addProperty("sampleRateHertz", 48000);
            config.addProperty("languageCode", "ko-KR");
            config.addProperty("model", "command_and_search"); // 짧은 명령에 최적화된 모델
            config.addProperty("enableAutomaticPunctuation", true);

            JsonObject audio = new JsonObject();
            audio.addProperty("content", audioContent);

            requestBody.add("config", config);
            requestBody.add("audio", audio);

            // API 호출
            String url = String.format("/speech:recognize?key=%s", apiKey);

            System.out.println("Sending STT request to Google...");

            String responseStr = webClient.post()
                    .uri(url)
                    .bodyValue(gson.toJson(requestBody))
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            System.out.println("Google STT Response: " + responseStr);

            // Response 파싱
            JsonObject response = gson.fromJson(responseStr, JsonObject.class);

            if (!response.has("results")) {
                System.out.println("No results found in STT response.");
                return ""; // 인식된 결과 없음
            }

            JsonArray results = response.getAsJsonArray("results");
            StringBuilder transcript = new StringBuilder();

            for (int i = 0; i < results.size(); i++) {
                JsonObject result = results.get(i).getAsJsonObject();
                JsonArray alternatives = result.getAsJsonArray("alternatives");
                if (alternatives.size() > 0) {
                    String text = alternatives.get(0).getAsJsonObject().get("transcript").getAsString();
                    transcript.append(text);
                    System.out.println("Transcript chunk: " + text);
                }
            }

            return transcript.toString();

        } catch (Exception e) {
            System.err.println("STT REST API Error: " + e.getMessage());
            e.printStackTrace();
            throw new IOException("STT processing failed: " + e.getMessage(), e);
        }
    }
}
