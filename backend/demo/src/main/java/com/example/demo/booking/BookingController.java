package com.example.demo.booking;

import com.example.demo.API.BookingRequestDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    // POST /api/bookings
    @PostMapping("/api/bookings")
    public ResponseEntity<String> createBooking(@RequestBody BookingRequestDto requestDto) {
        bookingService.bookTrain(requestDto.getUserId(), requestDto.getTrainId());
        return ResponseEntity.ok("예매가 완료되었습니다.");
    }

    // GET /api/users/1/bookings
    @GetMapping("/api/users/{userId}/bookings")
    public List<Booking> getUserBookings(@PathVariable Long userId) {
        return bookingService.findBookingsByUserId(userId);
    }
}
