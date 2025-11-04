package com.example.demo.booking;

import com.example.demo.booking.dto.BookingResponseDto;
import com.example.demo.security.UserDetailsImpl;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
public class PaymentController {

    private final BookingService bookingService;

    @PostMapping("/process")
    public ResponseEntity<BookingResponseDto> processPayment(
            @RequestBody PaymentRequest request,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {

        Long userId = userDetails.getUser().getId();
        BookingResponseDto confirmedBooking = bookingService.confirmBooking(request.getBookingId(), userId);
        return ResponseEntity.ok(confirmedBooking);
    }

    @Data
    static class PaymentRequest {
        private Long bookingId;
    }
}
