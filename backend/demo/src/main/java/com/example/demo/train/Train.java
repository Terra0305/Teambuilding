package com.example.demo.train;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor
public class Train {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String trainNumber; // 기차 번호 (e.g., KTX_101)
    private String origin;      // 출발지
    private String destination; // 목적지
    private LocalDateTime departureTime; // 출발 시간
    private LocalDateTime arrivalTime;   // 도착 시간
    private Integer price; // 가격

    public Train(String trainNumber, String origin, String destination, LocalDateTime departureTime, LocalDateTime arrivalTime, Integer price) {
        this.trainNumber = trainNumber;
        this.origin = origin;
        this.destination = destination;
        this.departureTime = departureTime;
        this.arrivalTime = arrivalTime;
        this.price = price;
    }
}
