package com.group7.cinema_backend.controller;

import com.group7.cinema_backend.entity.Cinema;
import com.group7.cinema_backend.repository.CinemaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;


/* API: Lấy danh sách tất cả các rạp*/
@RestController
@RequestMapping("/api/cinemas")
@RequiredArgsConstructor
public class CinemaController {
    private final CinemaRepository cinemaRepository;

    @GetMapping
    public ResponseEntity<List<Cinema>> getAllCinemas() {
        return ResponseEntity.ok(cinemaRepository.findAll());
    }
}