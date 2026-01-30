package com.example.demo;

import com.example.demo.booking.BookingRepository;
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
    private final BookingRepository bookingRepository;
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

            // 기존 데이터 삭제 (순서 중요: Booking -> Train)
            System.out.println("기차 데이터 초기화 및 재생성 시작...");
            bookingRepository.deleteAll(); // Booking이 Train을 참조하므로 먼저 삭제
            trainRepository.deleteAll(); // 기존 데이터 삭제

            // 2025년 1월 1일부터 오늘+90일까지
            LocalDate startDate = LocalDate.of(2025, 1, 1);
            LocalDate today = LocalDate.now();
            LocalDate endDate = today.plusDays(90);

            System.out.println("생성 기간: " + startDate + " ~ " + endDate);

            List<Train> trains = new ArrayList<>();

            for (LocalDate date = startDate; !date.isAfter(endDate); date = date.plusDays(1)) {
                // 1) 용산 <-> 광주송정 (호남선)
                addTrain(trains, date, "KTX", "용산", "광주송정", 9, 0, 2, 30, 50000);
                addTrain(trains, date, "KTX", "광주송정", "용산", 14, 0, 2, 30, 50000);

                // 2) 서울 <-> 광주송정 (사용자 요청 대응)
                addTrain(trains, date, "KTX", "서울", "광주송정", 10, 0, 2, 40, 52000);
                addTrain(trains, date, "KTX", "광주송정", "서울", 15, 0, 2, 40, 52000);
                // 심야 기차 추가 (밤 늦게 테스트하는 경우 대비)
                addTrain(trains, date, "KTX", "서울", "광주송정", 22, 30, 2, 40, 48000);
                addTrain(trains, date, "KTX", "광주송정", "서울", 22, 0, 2, 40, 48000);

                // 3) 서울 <-> 부산 (경부선)
                addTrain(trains, date, "KTX", "서울", "부산", 8, 30, 2, 45, 59800);
                addTrain(trains, date, "KTX", "부산", "서울", 13, 30, 2, 45, 59800);
                // 심야 기차 추가
                addTrain(trains, date, "KTX", "서울", "부산", 23, 0, 2, 45, 53800);
                addTrain(trains, date, "KTX", "부산", "서울", 22, 30, 2, 45, 53800);
            }

            trainRepository.saveAll(trains);
            System.out.println("총 " + trains.size() + "개의 기차 생성 완료!");

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

    private void addTrain(List<Train> trains, LocalDate date, String type,
            String origin, String destination,
            int deptHour, int deptMin, int durationHours, int durationMins, int price) {

        LocalDateTime departureTime = date.atTime(deptHour, deptMin);
        LocalDateTime arrivalTime = departureTime.plusHours(durationHours).plusMinutes(durationMins);

        // 기차 번호 생성 (예: KTX_0130_1)
        // 날짜별로 유니크하게 만들기 위해 해시코드 등의 조합보다는
        // 단순히 순차적으로 만들거나 랜덤을 섞어야 하지만,
        // 여기서는 편의상 출발시간 기반으로 생성
        String trainNumber = String.format("%s_%02d%02d_%02d%02d",
                type, date.getMonthValue(), date.getDayOfMonth(), deptHour, deptMin);

        Train train = new Train(trainNumber, origin, destination,
                departureTime, arrivalTime, price);
        trains.add(train);
    }
}
