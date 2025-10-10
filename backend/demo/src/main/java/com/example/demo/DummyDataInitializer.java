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
            
            // 기차 데이터 대량 생성
            if (existingTrainCount == 0) {
                System.out.println("대량 기차 데이터 생성 중...");
                
                List<Train> trains = new ArrayList<>();
                
                // 주요 노선 정의
                String[][] routes = {
                    {"용산", "광주송정"},
                    {"서울", "부산"},
                    {"용산", "대전"},
                    {"서울", "대구"},
                    {"용산", "목포"},
                    {"서울", "광주송정"},
                    {"용산", "부산"},
                    {"서울", "동대구"}
                };
                
                // 2024년 1월 1일부터 2025년 10월 3일까지
                LocalDate startDate = LocalDate.of(2024, 1, 1);
                LocalDate endDate = LocalDate.of(2025, 10, 3);
                
                int trainCount = 0;
                
                // 각 날짜에 대해
                for (LocalDate date = startDate; !date.isAfter(endDate); date = date.plusDays(1)) {
                    
                    // 각 노선에 대해
                    for (String[] route : routes) {
                        String origin = route[0];
                        String destination = route[1];
                        
                        // 하루에 6편씩 (06시, 09시, 12시, 15시, 18시, 21시)
                        int[] hours = {6, 9, 12, 15, 18, 21};
                        
                        for (int hour : hours) {
                            LocalDateTime departureTime = date.atTime(hour, 0);
                            LocalDateTime arrivalTime = departureTime.plusHours(2).plusMinutes(30);
                            
                            String trainNumber = String.format("KTX_%s_%02d%02d_%02d", 
                                origin.substring(0, 1), 
                                date.getMonthValue(), 
                                date.getDayOfMonth(),
                                hour);
                            
                            int price = 40000 + (int)(Math.random() * 20000); // 40000~60000원
                            
                            Train train = new Train(trainNumber, origin, destination, 
                                departureTime, arrivalTime, price);
                            trains.add(train);
                            trainCount++;
                            
                            // 1000개마다 저장 (메모리 효율)
                            if (trains.size() >= 1000) {
                                trainRepository.saveAll(trains);
                                trains.clear();
                                System.out.println("진행 중... " + trainCount + "개 생성됨");
                            }
                        }
                    }
                }
                
                // 남은 데이터 저장
                if (!trains.isEmpty()) {
                    trainRepository.saveAll(trains);
                }
                
                System.out.println("총 " + trainCount + "개의 기차 생성 완료!");
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
