package com.example.demo.booking;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    // 특정 회원의 예매 목록을 전부 가져오는 기능
    List<Booking> findAllByUser_Id(Long userId);

    @Query("SELECT b FROM Booking b JOIN FETCH b.user JOIN FETCH b.train WHERE b.user.id = :userId AND b.status = 'CONFIRMED'")
    List<Booking> findAllByUserIdWithDetails(@Param("userId") Long userId);
    
}
