package com.example.demo.train;

import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class TrainController {

    private final TrainService trainService;
    private final TrainRepository trainRepository;

    // GET /api/trains?origin=용산&destination=광주송정&date=2025-08-03
    @GetMapping("/api/trains")
    public ResponseEntity<?> getTrains(@RequestParam String origin,
                                       @RequestParam String destination,
                                       @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        try {
            System.out.println("=== TrainController 디버깅 ===");
            System.out.println("받은 파라미터:");
            System.out.println("- origin: " + origin);
            System.out.println("- destination: " + destination);
            System.out.println("- date: " + date);
            
            // 전체 기차 개수 확인
            long totalCount = trainRepository.count();
            System.out.println("- 전체 기차 개수: " + totalCount);
            
            // 모든 기차 목록 출력 (디버깅용)
            List<Train> allTrains = trainRepository.findAll();
            System.out.println("- 전체 기차 목록:");
            for (Train train : allTrains) {
                System.out.println("  * " + train.getTrainNumber() + ": " + train.getOrigin() + " -> " + train.getDestination() + " (" + train.getDepartureTime() + ")");
            }
            
            // 실제 검색 수행
            List<Train> searchResult = trainService.searchTrains(origin, destination, date);
            System.out.println("- 검색 결과 개수: " + searchResult.size());
            
            for (Train train : searchResult) {
                System.out.println("  * 검색된 기차: " + train.getTrainNumber() + " (" + train.getDepartureTime() + ")");
            }
            
            return ResponseEntity.ok(searchResult);
            
        } catch (Exception e) {
            System.err.println("=== TrainController 오류 발생 ===");
            System.err.println("오류 메시지: " + e.getMessage());
            System.err.println("오류 타입: " + e.getClass().getSimpleName());
            e.printStackTrace();
            
            return ResponseEntity.status(500).body("서버 오류: " + e.getMessage());
        }
    }
}