package com.example.demo.booking;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    // 특정 회원의 예매 목록을 전부 가져오는 기능
    List<Booking> findAllByUser_Id(Long userId);
}
