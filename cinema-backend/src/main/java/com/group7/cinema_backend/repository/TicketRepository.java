package com.group7.cinema_backend.repository;

import com.group7.cinema_backend.entity.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, Long> {
    // Tìm tất cả vé đã bán của 1 suất chiếu
    List<Ticket> findByShowtimeId(Long showtimeId);
}