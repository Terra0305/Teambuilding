package com.example.demo.booking;

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
    private final LocalDateTime bookingDate;

    // Booking 엔티티를 이 DTO로 변환하는 생성자
    public BookingResponseDto(Booking booking) {
        this.bookingId = booking.getId();
        Train train = booking.getTrain();
        this.trainNumber = train.getTrainNumber();
        this.origin = train.getOrigin();
        this.destination = train.getDestination();
        this.departureTime = train.getDepartureTime();
        this.bookingDate = booking.getBookingDate();
    }
}