package com.example.demo.booking;

import com.example.demo.train.Train;
import com.example.demo.entity.User; 
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

    public Booking(User user, Train train) {
        this.user = user;
        this.train = train;
        this.bookingDate = LocalDateTime.now();
    }
}