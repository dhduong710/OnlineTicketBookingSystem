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
            // Gọi hàm tìm kiếm đã viết trong Repository ở bước trước
            List<Showtime> showtimes = showtimeRepository.findShowtimesByMovieAndDate(movieId, date);
            return ResponseEntity.ok(showtimes);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/{showtimeId}/seats")
    public ResponseEntity<List<SeatResponse>> getShowtimeSeats(@PathVariable Long showtimeId) {
        // 1. Lấy thông tin suất chiếu để biết Phòng nào và Giá vé gốc
        var showtime = showtimeRepository.findById(showtimeId)
                .orElseThrow(() -> new RuntimeException("Showtime not found"));
        
        // 2. Lấy tất cả ghế của phòng đó (Layout vật lý)
        List<Seat> allSeats = seatRepository.findByRoomIdOrderByRowAscColAsc(showtime.getRoom().getId());

        // 3. Lấy tất cả vé đã bán của suất này (Ghế đã đặt)
        List<Ticket> bookedTickets = ticketRepository.findByShowtimeId(showtimeId);
        List<Long> bookedSeatIds = bookedTickets.stream()
                .map(ticket -> ticket.getSeat().getId())
                .toList();

        // 4. Giá vé cơ bản 
        // 2D = 50k, 3D = 80k. VIP + 20k.
        double basePrice = showtime.getFormat().equals("3D") || showtime.getFormat().contains("IMAX") ? 80000 : 50000;

        // 5. Map sang DTO để trả về Frontend
        List<SeatResponse> response = allSeats.stream().map(seat -> {
            boolean isBooked = bookedSeatIds.contains(seat.getId());
            double seatPrice = basePrice;
            if (seat.getType().equals("VIP")) {
                seatPrice += 20000; // Phụ thu ghế VIP
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
}