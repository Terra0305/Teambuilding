package com.example.demo.booking;

import com.example.demo.train.Train;
import com.example.demo.user.User; 
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "train_id")
    private Train train;

    private LocalDateTime bookingDate;

    @Enumerated(EnumType.STRING) // Enum을 String으로 DB에 저장
    private BookingStatus status;

    public Booking(User user, Train train) {
        this.user = user;
        this.train = train;
        this.bookingDate = LocalDateTime.now();
        this.status = BookingStatus.CONFIRMED; // 초기 상태를 CONFIRMED로 설정
    }

    public void setStatus(BookingStatus status) {
        this.status = status;
    }
}