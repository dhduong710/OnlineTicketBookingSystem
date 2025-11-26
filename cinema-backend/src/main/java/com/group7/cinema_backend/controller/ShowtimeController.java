package com.group7.cinema_backend.controller;

import com.group7.cinema_backend.entity.Showtime;
import com.group7.cinema_backend.repository.ShowtimeRepository;
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

    private final ShowtimeRepository showtimeRepository;

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
}