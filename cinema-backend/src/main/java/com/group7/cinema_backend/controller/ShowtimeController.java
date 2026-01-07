package com.group7.cinema_backend.controller;

import com.group7.cinema_backend.dto.SeatResponse;
import com.group7.cinema_backend.entity.Showtime;
import com.group7.cinema_backend.service.ShowtimeService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/showtimes")
@RequiredArgsConstructor
public class ShowtimeController {

    private final ShowtimeService showtimeService;

    // Lấy danh sách suất chiếu theo Phim và Ngày
    @GetMapping
    public ResponseEntity<List<Showtime>> getShowtimes(
            @RequestParam Long movieId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date
    ) {
        return ResponseEntity.ok(showtimeService.getShowtimesByMovie(movieId, date));
    }

    // Lấy sơ đồ ghế (kèm trạng thái) của 1 suất chiếu
    // Logic phức tạp đã được đẩy sang Service, Controller giờ rất gọn
    @GetMapping("/{showtimeId}/seats")
    public ResponseEntity<List<SeatResponse>> getShowtimeSeats(@PathVariable Long showtimeId) {
        try {
            List<SeatResponse> seats = showtimeService.getShowSeats(showtimeId);
            return ResponseEntity.ok(seats);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Lấy suất chiếu theo Rạp và Ngày: /api/showtimes/cinema?cinemaId=7&date=2026-01-07
    @GetMapping("/cinema")
    public ResponseEntity<List<Showtime>> getShowtimesByCinema(
            @RequestParam Long cinemaId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date
    ) {
        return ResponseEntity.ok(showtimeService.getShowtimesByCinema(cinemaId, date));
    }
    
    // API lấy theo rạp (Giữ nguyên hoặc chuyển logic sang service nếu muốn đồng bộ)
    // Tạm thời giữ nguyên Repository call ở đây cũng được nếu chưa viết hàm trong Service
}