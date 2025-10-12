package com.example.demo.booking;

import com.example.demo.booking.dto.BookingRequestDto;
import com.example.demo.booking.dto.BookingResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import com.example.demo.security.UserDetailsImpl;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @PostMapping("/api/bookings")
    public ResponseEntity<BookingResponseDto> createBooking(
            @RequestBody BookingRequestDto requestDto,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        Long userId = userDetails.getUser().getId();
        BookingResponseDto booking = bookingService.bookTrain(userId, requestDto.getTrainId());
        return ResponseEntity.ok(booking);
    }

    @GetMapping("/api/my-bookings")
    public List<BookingResponseDto> getMyBookings(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        Long userId = userDetails.getUser().getId();
        return bookingService.findBookingsByUserId(userId);
    }

    @DeleteMapping("/api/bookings/{bookingId}")
    public ResponseEntity<String> cancelBooking(@PathVariable Long bookingId, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        Long userId = userDetails.getUser().getId(); // 현재 로그인한 사용자의 ID
        bookingService.cancelBooking(bookingId, userId);
        return ResponseEntity.ok("예매가 성공적으로 취소되었습니다.");
    }
}