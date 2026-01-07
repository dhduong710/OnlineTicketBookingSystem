package com.group7.cinema_backend.controller;

import com.group7.cinema_backend.dto.AuthResponse;
import com.group7.cinema_backend.dto.LoginRequest;
import com.group7.cinema_backend.dto.MovieScheduleRequest;
import com.group7.cinema_backend.dto.MovieScheduleResponse;
import com.group7.cinema_backend.dto.RevenueStatsRequest;
import com.group7.cinema_backend.dto.RevenueStatsResponse;
import com.group7.cinema_backend.dto.CustomerSpendingResponse;
import com.group7.cinema_backend.entity.Cinema;
import com.group7.cinema_backend.entity.Genre;
import com.group7.cinema_backend.entity.Movie;
import com.group7.cinema_backend.repository.CinemaRepository;
import com.group7.cinema_backend.repository.GenreRepository;
import com.group7.cinema_backend.repository.MovieRepository;
import com.group7.cinema_backend.service.AdminService;
import com.group7.cinema_backend.service.MovieScheduleService;
import com.group7.cinema_backend.service.RevenueService;
import com.group7.cinema_backend.service.CustomerAnalyticsService;
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
    private final RevenueService revenueService;
    private final CustomerAnalyticsService customerAnalyticsService;
    private final CinemaRepository cinemaRepository;
    private final GenreRepository genreRepository;
    private final MovieRepository movieRepository;

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

    // Lấy danh sách movies (cho filter)
    @GetMapping("/movies")
    public ResponseEntity<List<Movie>> getMovies() {
        return ResponseEntity.ok(movieRepository.findAll());
    }

    // Thống kê doanh thu
    @PostMapping("/revenue/stats")
    public ResponseEntity<RevenueStatsResponse> getRevenueStats(@RequestBody RevenueStatsRequest request) {
        return ResponseEntity.ok(revenueService.getRevenueStats(request));
    }

    // Tra cứu chi tiêu khách hàng
    @GetMapping("/customers/spending")
    public ResponseEntity<CustomerSpendingResponse> getCustomerSpending(@RequestParam String email) {
        CustomerSpendingResponse response = customerAnalyticsService.getCustomerSpending(email);
        if (response == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(response);
    }

    // Top khách hàng chi tiêu nhiều nhất
    @GetMapping("/customers/top")
    public ResponseEntity<List<CustomerSpendingResponse>> getTopCustomers(
            @RequestParam(defaultValue = "10") int limit
    ) {
        return ResponseEntity.ok(customerAnalyticsService.getTopCustomers(limit));
    }
}
