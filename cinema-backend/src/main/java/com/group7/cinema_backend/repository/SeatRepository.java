package com.group7.cinema_backend.repository;

import com.group7.cinema_backend.entity.Seat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SeatRepository extends JpaRepository<Seat, Long> {
    // Lấy tất cả ghế của một phòng, sắp xếp theo Hàng và Cột để vẽ
    List<Seat> findByRoomIdOrderByRowAscColAsc(Long roomId);
}