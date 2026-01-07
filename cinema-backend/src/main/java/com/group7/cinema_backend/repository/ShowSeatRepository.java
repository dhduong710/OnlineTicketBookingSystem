package com.group7.cinema_backend.repository;

import com.group7.cinema_backend.entity.ShowSeat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ShowSeatRepository extends JpaRepository<ShowSeat, Long> {
    // Lấy danh sách ghế (kèm trạng thái) của một suất chiếu để hiển thị lên màn hình chọn ghế
    List<ShowSeat> findByShowtimeId(Long showtimeId);
}