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
        try {
            System.out.println("=== DummyDataInitializer 시작 ===");
            
            // 기존 데이터 확인
            long existingTrainCount = trainRepository.count();
            long existingUserCount = userRepository.count();
            System.out.println("기존 기차 데이터 개수: " + existingTrainCount);
            System.out.println("기존 사용자 데이터 개수: " + existingUserCount);
            
            // 사용자 데이터 생성
            if (existingUserCount == 0) {
                System.out.println("사용자 데이터 생성 중...");
                User user = new User("user1", passwordEncoder.encode("password123"), "박성민");
                userRepository.save(user);
                System.out.println("사용자 생성 완료: " + user.getUsername());
            } else {
                System.out.println("기존 사용자가 존재하므로 사용자 생성 건너뜀");
            }
            
            // 기차 데이터 생성
            if (existingTrainCount == 0) {
                System.out.println("기차 데이터 생성 중...");
                
                Train train1 = new Train("KTX_405", "용산", "광주송정", 
                    LocalDateTime.of(2025, 8, 3, 15, 0), 
                    LocalDateTime.of(2025, 8, 3, 16, 50), 48000);
                Train train2 = new Train("KTX_407", "용산", "광주송정", 
                    LocalDateTime.of(2025, 8, 3, 16, 0), 
                    LocalDateTime.of(2025, 8, 3, 17, 50), 48000);
                
                trainRepository.save(train1);
                trainRepository.save(train2);
                
                System.out.println("기차 1 생성: " + train1.getTrainNumber() + " (" + train1.getDepartureTime() + ")");
                System.out.println("기차 2 생성: " + train2.getTrainNumber() + " (" + train2.getDepartureTime() + ")");
                
                // 추가로 오늘 날짜 데이터도 생성
                LocalDateTime today = LocalDateTime.now();
                Train todayTrain = new Train("KTX_TODAY", "용산", "광주송정",
                    today.withHour(15).withMinute(0).withSecond(0).withNano(0),
                    today.withHour(16).withMinute(50).withSecond(0).withNano(0), 48000);
                trainRepository.save(todayTrain);
                System.out.println("오늘 날짜 기차 생성: " + todayTrain.getTrainNumber() + " (" + todayTrain.getDepartureTime() + ")");
                
            } else {
                System.out.println("기존 기차가 존재하므로 기차 생성 건너뜀");
            }
            
            // 최종 상태 확인
            long finalTrainCount = trainRepository.count();
            long finalUserCount = userRepository.count();
            System.out.println("=== 초기화 완료 ===");
            System.out.println("최종 기차 개수: " + finalTrainCount);
            System.out.println("최종 사용자 개수: " + finalUserCount);
            
        } catch (Exception e) {
            System.err.println("=== DummyDataInitializer 오류 ===");
            System.err.println("오류 메시지: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }
}