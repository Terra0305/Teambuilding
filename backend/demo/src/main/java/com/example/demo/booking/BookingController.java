package com.example.demo.booking;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @PostMapping("/api/bookings")
    public ResponseEntity<String> createBooking(@RequestBody BookingRequestDto requestDto) {
        bookingService.bookTrain(requestDto.getUserId(), requestDto.getTrainId());
        return ResponseEntity.ok("예매가 완료되었습니다.");
    }

    @GetMapping("/api/users/{userId}/bookings")
    public List<BookingResponseDto> getUserBookings(@PathVariable Long userId) {
        return bookingService.findBookingsByUserId(userId);
    }
}