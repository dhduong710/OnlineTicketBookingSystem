package com.group7.cinema_backend.repository;

import com.group7.cinema_backend.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    // Tìm lịch sử đặt vé của 1 khách hàng (để hiện trang Lịch sử)
    List<Booking> findByCustomer_EmailOrderByBookingTimeDesc(String email);
}