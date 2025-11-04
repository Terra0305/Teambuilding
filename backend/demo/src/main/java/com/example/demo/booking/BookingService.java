package com.example.demo.booking;

import com.example.demo.booking.dto.BookingResponseDto;
import com.example.demo.train.Train;
import com.example.demo.train.TrainRepository;
import com.example.demo.user.User;
import com.example.demo.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final TrainRepository trainRepository;

    @Transactional
    public BookingResponseDto bookTrain(Long userId, Long trainId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("존재하지 않는 회원입니다."));
        Train train = trainRepository.findById(trainId).orElseThrow(() -> new IllegalArgumentException("존재하지 않는 기차입니다."));

        Booking newBooking = new Booking(user, train);
        Booking savedBooking = bookingRepository.save(newBooking);
        return new BookingResponseDto(savedBooking);
    }

    @Transactional(readOnly = true)
    public List<BookingResponseDto> findBookingsByUserId(Long userId) {
        List<Booking> bookings = bookingRepository.findAllByUserIdWithDetails(userId);
        return bookings.stream()
                .map(BookingResponseDto::new)
                .collect(Collectors.toList());
    }

    @Transactional
    public BookingResponseDto confirmBooking(Long bookingId, Long userId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 예매입니다."));

        if (!booking.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("예매 확인 권한이 없습니다.");
        }

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new IllegalStateException("이미 처리된 예매입니다.");
        }

        booking.setStatus(BookingStatus.CONFIRMED);
        Booking savedBooking = bookingRepository.save(booking);
        return new BookingResponseDto(savedBooking);
    }

    @Transactional
    public void cancelBooking(Long bookingId, Long userId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 예매입니다."));

        // 예매를 취소하려는 사용자가 해당 예매의 소유자인지 확인
        if (!booking.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("예매 취소 권한이 없습니다.");
        }

        // 예매 상태를 CANCELED로 변경
        booking.setStatus(BookingStatus.CANCELED);
        bookingRepository.save(booking); // 변경된 상태 저장
    }
}