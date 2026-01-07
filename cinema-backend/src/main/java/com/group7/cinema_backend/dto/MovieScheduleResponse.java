package com.group7.cinema_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MovieScheduleResponse {
    private Long movieId;
    private String movieTitle;
    private Integer showtimesCreated;
    private String message;
}
