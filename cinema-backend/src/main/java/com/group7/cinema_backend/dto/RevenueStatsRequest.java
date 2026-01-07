package com.group7.cinema_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RevenueStatsRequest {
    private LocalDate startDate;
    private LocalDate endDate;
    private String city;        // Optional filter
    private Long cinemaId;      // Optional filter
    private Long movieId;       // Optional filter
}
