package com.example.demo.booking;

import com.example.demo.train.Train;
import com.example.demo.train.TrainRepository;
import com.example.demo.user.User;
import com.example.demo.user.UserRepository; // 팀원이 만들 UserRepository
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

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
    public List<Booking> findBookingsByUserId(Long userId) {
        return bookingRepository.findAllByUser_Id(userId);
    }
}
