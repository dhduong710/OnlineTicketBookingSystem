package com.group7.cinema_backend.controller;

import com.group7.cinema_backend.entity.Movie;
import com.group7.cinema_backend.service.MovieService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/movies")
@RequiredArgsConstructor
public class MovieController {

    private final MovieService movieService;

    @GetMapping
    public ResponseEntity<List<Movie>> getAllMovies() {
        return ResponseEntity.ok(movieService.getAllMovies());
    }

    // Nếu muốn giữ hàm getById, bạn nên thêm nó vào MovieService, 
    // hoặc tạm thời gọi Repository cũng được, nhưng tốt nhất là qua Service.
}