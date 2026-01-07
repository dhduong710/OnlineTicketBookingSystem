package com.group7.cinema_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RevenueStatsResponse {
    private double totalRevenue;
    private int totalBookings;
    private int totalTickets;
    private List<CityRevenue> revenueByCity;
    private List<CinemaRevenue> revenueByCinema;
    private List<MovieRevenue> revenueByMovie;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CityRevenue {
        private String city;
        private double revenue;
        private int bookings;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CinemaRevenue {
        private Long cinemaId;
        private String cinemaName;
        private String city;
        private double revenue;
        private int bookings;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MovieRevenue {
        private Long movieId;
        private String movieTitle;
        private double revenue;
        private int tickets;
    }
}
