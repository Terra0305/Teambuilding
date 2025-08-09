package com.example.demo;

import com.example.demo.train.Train;
import com.example.demo.train.TrainRepository;
import com.example.demo.user.User;
import com.example.demo.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class DummyDataInitializer implements CommandLineRunner {

    private final TrainRepository trainRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // User 생성 시 username, password, name 3개만 전달합니다.
        // role="USER"는 User 클래스 안에서 자동으로 설정됩니다.
        userRepository.save(new User("user1", passwordEncoder.encode("password123"), "박성민"));
        
        // 기차 데이터 생성
        Train train1 = new Train("KTX_405", "용산", "광주송정", LocalDateTime.of(2025, 8, 3, 15, 0), LocalDateTime.of(2025, 8, 3, 16, 50), 48000);
        Train train2 = new Train("KTX_407", "용산", "광주송정", LocalDateTime.of(2025, 8, 3, 16, 0), LocalDateTime.of(2025, 8, 3, 17, 50), 48000);
        trainRepository.save(train1);
        trainRepository.save(train2);
    }
}