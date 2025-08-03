package com.example.demo;

import com.example.demo.train.Train;
import com.example.demo.train.TrainRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import java.time.LocalDateTime;

@Component
public class DummyDataInitializer implements CommandLineRunner {

    private final TrainRepository trainRepository;

    public DummyDataInitializer(TrainRepository trainRepository) {
        this.trainRepository = trainRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        // 서버 시작 시 KTX 2개 추가
        Train train1 = new Train("KTX_405", "용산", "광주송정", LocalDateTime.of(2025, 8, 3, 15, 0), LocalDateTime.of(2025, 8, 3, 16, 50), 48000);
        Train train2 = new Train("KTX_407", "용산", "광주송정", LocalDateTime.of(2025, 8, 3, 16, 0), LocalDateTime.of(2025, 8, 3, 17, 50), 48000);
        trainRepository.save(train1);
        trainRepository.save(train2);
    }
}
