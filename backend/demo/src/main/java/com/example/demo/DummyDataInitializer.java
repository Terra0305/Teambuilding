package com.example.demo;

import com.example.demo.train.Train;
import com.example.demo.train.TrainRepository;
import com.example.demo.user.User;
import com.example.demo.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

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
            }
            
            // 기차 데이터 생성 (2025년 1월 1일부터 오늘까지, 하루 1개씩)
            System.out.println("기차 데이터 생성 시작...");
            
            // 2025년 1월 1일부터 오늘까지
            LocalDate startDate = LocalDate.of(2025, 1, 1);
            LocalDate today = LocalDate.now();
            
            System.out.println("생성 기간: " + startDate + " ~ " + today);
            
            List<Train> trains = new ArrayList<>();
            
            // 2025년 1월 1일부터 오늘까지 하루에 1개씩 생성
            for (LocalDate date = startDate; !date.isAfter(today); date = date.plusDays(1)) {
                // 오전 9시 출발 기차 1개 생성
                LocalDateTime departureTime = date.atTime(9, 0);
                LocalDateTime arrivalTime = departureTime.plusHours(2).plusMinutes(30);
                
                String trainNumber = String.format("KTX_%02d%02d", 
                    date.getMonthValue(), 
                    date.getDayOfMonth());
                
                int price = 50000; // 고정 가격
                
                Train train = new Train(trainNumber, "용산", "광주송정", 
                    departureTime, arrivalTime, price);
                trains.add(train);
            }
            
            // 데이터 저장
            if (!trains.isEmpty()) {
                trainRepository.saveAll(trains);
                System.out.println("총 " + trains.size() + "개의 기차 생성 완료!");
            }
            
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
