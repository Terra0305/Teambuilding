package com.example.demo.booking;

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
    public Booking bookTrain(Long userId, Long trainId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("존재하지 않는 회원입니다."));
        Train train = trainRepository.findById(trainId).orElseThrow(() -> new IllegalArgumentException("존재하지 않는 기차입니다."));

        Booking newBooking = new Booking(user, train);
        return bookingRepository.save(newBooking);
    }

    @Transactional(readOnly = true)
    public List<BookingResponseDto> findBookingsByUserId(Long userId) {
        List<Booking> bookings = bookingRepository.findAllByUserIdWithDetails(userId);
        return bookings.stream()
                .map(BookingResponseDto::new)
                .collect(Collectors.toList());
    }
}