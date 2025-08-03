package com.example.demo;

import com.example.demo.train.Train;
import com.example.demo.train.TrainRepository;
import com.example.demo.user.User;
import com.example.demo.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class DummyDataInitializer implements CommandLineRunner {

    private final TrainRepository trainRepository;
    private final UserRepository userRepository;

    @Override
    public void run(String... args) throws Exception {
        System.out.println("=========================================");
        System.out.println("DummyDataInitializer: 데이터 생성을 시작합니다...");

        // User 데이터 생성
        userRepository.save(new User("박성민"));
        System.out.println(">>> 유저 데이터 '박성민' 생성 시도 완료.");


        // Train 데이터 생성
        Train train1 = new Train("KTX_405", "용산", "광주송정", LocalDateTime.of(2025, 8, 3, 15, 0), LocalDateTime.of(2025, 8, 3, 16, 50), 48000);
        Train train2 = new Train("KTX_407", "용산", "광주송정", LocalDateTime.of(2025, 8, 3, 16, 0), LocalDateTime.of(2025, 8, 3, 17, 50), 48000);
        trainRepository.save(train1);
        trainRepository.save(train2);
        System.out.println(">>> 기차 데이터 2개 생성 성공");

        System.out.println("DummyDataInitializer: 데이터 생성 완료.");
        System.out.println("=========================================");
    }
}