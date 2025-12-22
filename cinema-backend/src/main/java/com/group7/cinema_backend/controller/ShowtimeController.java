package com.group7.cinema_backend.controller;

import com.group7.cinema_backend.entity.Showtime;
import com.group7.cinema_backend.repository.ShowtimeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

import com.group7.cinema_backend.dto.SeatResponse;
import com.group7.cinema_backend.entity.Seat;
import com.group7.cinema_backend.entity.Ticket;
import com.group7.cinema_backend.repository.SeatRepository;
import com.group7.cinema_backend.repository.TicketRepository;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/showtimes")
@RequiredArgsConstructor
public class ShowtimeController {

    private final ShowtimeRepository showtimeRepository;

    private final SeatRepository seatRepository;   
    private final TicketRepository ticketRepository; 

    // API: Lấy danh sách suất chiếu theo Phim và Ngày
    // URL ví dụ: /api/showtimes?movieId=1&date=2025-`12-25
    @GetMapping
    public ResponseEntity<List<Showtime>> getShowtimes(
            @RequestParam Long movieId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date
    ) {
        try {
            
            List<Showtime> showtimes = showtimeRepository.findShowtimesByMovieAndDate(movieId, date);
            return ResponseEntity.ok(showtimes);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }


    @GetMapping("/{showtimeId}/seats")
    public ResponseEntity<List<SeatResponse>> getShowtimeSeats(@PathVariable Long showtimeId) {
        // 1. Lấy thông tin suất chiếu
        var showtime = showtimeRepository.findById(showtimeId)
                .orElseThrow(() -> new RuntimeException("Showtime not found"));
        
        // 2. Lấy danh sách ghế của phòng
        List<Seat> allSeats = seatRepository.findByRoomIdOrderByRowAscColAsc(showtime.getRoom().getId());

        // 3. Lấy vé đã bán 
        List<Ticket> bookedTickets = ticketRepository.findTicketsByShowtimeId(showtimeId);
        

        List<Long> bookedSeatIds = bookedTickets.stream()
                .map(ticket -> ticket.getSeat().getId())
                .toList();

        double basePrice = showtime.getFormat().equals("3D") || showtime.getFormat().contains("IMAX") ? 80000 : 50000;

        List<SeatResponse> response = allSeats.stream().map(seat -> {
            boolean isBooked = bookedSeatIds.contains(seat.getId());

            double seatPrice = basePrice;
            if (seat.getType().equals("VIP")) {
                seatPrice += 20000;
            }
            
            return new SeatResponse(
                seat.getId(),
                seat.getName(),
                seat.getRow(),
                seat.getCol(),
                seat.getType(),
                isBooked, 
                seatPrice
            );
        }).collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    // API: Lấy danh sách suất chiếu theo Rạp và Ngày
    // URL ví dụ: /api/showtimes/cinema?cinemaId=1&date=2025-12-25
    @GetMapping("/cinema")
    public ResponseEntity<List<Showtime>> getShowtimesByCinema(
        @RequestParam Long cinemaId,
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date
    ) {
        return ResponseEntity.ok(showtimeRepository.findShowtimesByCinemaAndDate(cinemaId, date));
    }
}