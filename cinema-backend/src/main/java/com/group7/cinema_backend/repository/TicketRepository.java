package com.group7.cinema_backend.repository;

import com.group7.cinema_backend.entity.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param; 
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, Long> {

    @Query("SELECT t FROM Ticket t WHERE t.showtime.id = :showtimeId")
    List<Ticket> findTicketsByShowtimeId(@Param("showtimeId") Long showtimeId);
}