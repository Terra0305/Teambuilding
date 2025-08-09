package com.example.demo.booking;

import com.example.demo.booking.dto.BookingRequestDto;
import com.example.demo.booking.dto.BookingResponseDto;
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

    // ★★★ 바로 이 부분! ★★★
    // @PathVariable에 괄호를 열고, URL의 변수 이름과 같게 "userId"라고 명시해줍니다.
    @GetMapping("/api/users/{userId}/bookings")
    public List<BookingResponseDto> getUserBookings(@PathVariable("userId") Long userId) {
        return bookingService.findBookingsByUserId(userId);
    }
}