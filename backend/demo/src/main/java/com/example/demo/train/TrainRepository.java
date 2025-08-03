package com.example.demo.train;

import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.List;

public interface TrainRepository extends JpaRepository<Train, Long> {
    // 출발지, 도착지, 특정 날짜(해당일 00:00 ~ 23:59)로 기차 목록 검색
    List<Train> findAllByOriginAndDestinationAndDepartureTimeBetween(
            String origin, String destination, LocalDateTime startOfDay, LocalDateTime endOfDay);
}
