package com.example.demo.booking.dto;

import com.example.demo.booking.Booking;
import com.example.demo.train.Train;
import lombok.Getter;
import java.time.LocalDateTime;

@Getter
public class BookingResponseDto {

    private final Long bookingId;
    private final String trainNumber;
    private final String origin;
    private final String destination;
    private final LocalDateTime departureTime;
    private final int price;
    private final LocalDateTime arrivalTime;
    private final LocalDateTime bookingDate;
    private final String status; // BookingStatus Enum의 이름을 String으로 저장

    // Booking 엔티티를 이 DTO로 변환하는 생성자
    public BookingResponseDto(Booking booking) {
        this.bookingId = booking.getId();
        Train train = booking.getTrain();
        this.trainNumber = train.getTrainNumber();
        this.origin = train.getOrigin();
        this.destination = train.getDestination();
        this.departureTime = train.getDepartureTime();
        this.arrivalTime = train.getArrivalTime();
        this.price = train.getPrice();
        this.bookingDate = booking.getBookingDate();
        this.status = booking.getStatus().name(); // BookingStatus Enum의 이름을 String으로 변환하여 저장
    }
}