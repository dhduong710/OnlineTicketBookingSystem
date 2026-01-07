package com.group7.cinema_backend.controller;

import com.group7.cinema_backend.dto.AuthResponse;
import com.group7.cinema_backend.dto.LoginRequest;
import com.group7.cinema_backend.dto.MovieScheduleRequest;
import com.group7.cinema_backend.dto.MovieScheduleResponse;
import com.group7.cinema_backend.entity.Cinema;
import com.group7.cinema_backend.entity.Genre;
import com.group7.cinema_backend.repository.CinemaRepository;
import com.group7.cinema_backend.repository.GenreRepository;
import com.group7.cinema_backend.service.AdminService;
import com.group7.cinema_backend.service.MovieScheduleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;
    private final MovieScheduleService movieScheduleService;
    private final CinemaRepository cinemaRepository;
    private final GenreRepository genreRepository;

    @PostMapping("/auth/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(adminService.login(request));
    }

    @PostMapping("/movies/schedule")
    public ResponseEntity<MovieScheduleResponse> createMovieWithSchedule(@RequestBody MovieScheduleRequest request) {
        return ResponseEntity.ok(movieScheduleService.createMovieWithSchedule(request));
    }

    // Lấy danh sách tỉnh thành
    @GetMapping("/cities")
    public ResponseEntity<List<String>> getCities() {
        return ResponseEntity.ok(cinemaRepository.findDistinctCities());
    }

    // Lấy danh sách rạp theo tỉnh
    @GetMapping("/cinemas")
    public ResponseEntity<List<Cinema>> getCinemasByCity(@RequestParam(required = false) String city) {
        if (city != null && !city.isEmpty()) {
            return ResponseEntity.ok(cinemaRepository.findByCity(city));
        }
        return ResponseEntity.ok(cinemaRepository.findAll());
    }

    // Lấy danh sách thể loại
    @GetMapping("/genres")
    public ResponseEntity<List<Genre>> getGenres() {
        return ResponseEntity.ok(genreRepository.findAll());
    }
}
