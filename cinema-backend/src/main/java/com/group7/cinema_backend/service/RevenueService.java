package com.group7.cinema_backend.service;

import com.group7.cinema_backend.dto.RevenueStatsRequest;
import com.group7.cinema_backend.dto.RevenueStatsResponse;
import com.group7.cinema_backend.entity.Booking;
import com.group7.cinema_backend.repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RevenueService {

    private final BookingRepository bookingRepository;

    public RevenueStatsResponse getRevenueStats(RevenueStatsRequest request) {
        // Lấy tất cả booking đã thanh toán
        List<Booking> allBookings = bookingRepository.findAll().stream()
                .filter(b -> "Paid".equalsIgnoreCase(b.getPaymentStatus()))
                .collect(Collectors.toList());

        // Filter by date range
        List<Booking> filteredBookings = allBookings.stream()
                .filter(booking -> {
                    // Lấy ngày từ showtime của ghế đầu tiên
                    if (booking.getShowSeats() == null || booking.getShowSeats().isEmpty()) {
                        return false;
                    }
                    LocalDate bookingDate = booking.getShowSeats().get(0).getShowtime().getShowDate();
                    
                    boolean afterStart = request.getStartDate() == null || 
                                        !bookingDate.isBefore(request.getStartDate());
                    boolean beforeEnd = request.getEndDate() == null || 
                                       !bookingDate.isAfter(request.getEndDate());
                    return afterStart && beforeEnd;
                })
                .collect(Collectors.toList());

        // Filter by city
        if (request.getCity() != null && !request.getCity().isEmpty()) {
            filteredBookings = filteredBookings.stream()
                    .filter(booking -> {
                        if (booking.getShowSeats() == null || booking.getShowSeats().isEmpty()) {
                            return false;
                        }
                        String city = booking.getShowSeats().get(0).getShowtime().getRoom().getCinema().getCity();
                        return request.getCity().equals(city);
                    })
                    .collect(Collectors.toList());
        }

        // Filter by cinema
        if (request.getCinemaId() != null) {
            filteredBookings = filteredBookings.stream()
                    .filter(booking -> {
                        if (booking.getShowSeats() == null || booking.getShowSeats().isEmpty()) {
                            return false;
                        }
                        Long cinemaId = booking.getShowSeats().get(0).getShowtime().getRoom().getCinema().getId();
                        return request.getCinemaId().equals(cinemaId);
                    })
                    .collect(Collectors.toList());
        }

        // Filter by movie
        if (request.getMovieId() != null) {
            filteredBookings = filteredBookings.stream()
                    .filter(booking -> {
                        if (booking.getShowSeats() == null || booking.getShowSeats().isEmpty()) {
                            return false;
                        }
                        Long movieId = booking.getShowSeats().get(0).getShowtime().getMovie().getId();
                        return request.getMovieId().equals(movieId);
                    })
                    .collect(Collectors.toList());
        }

        // Calculate total revenue
        double totalRevenue = filteredBookings.stream()
                .mapToDouble(b -> b.getOriginalAmount() - b.getDiscountAmount())
                .sum();

        int totalBookings = filteredBookings.size();
        
        int totalTickets = filteredBookings.stream()
                .mapToInt(b -> b.getShowSeats() != null ? b.getShowSeats().size() : 0)
                .sum();

        // Revenue by City
        Map<String, Double> cityRevenueMap = new HashMap<>();
        Map<String, Integer> cityBookingsMap = new HashMap<>();
        
        for (Booking booking : filteredBookings) {
            if (booking.getShowSeats() == null || booking.getShowSeats().isEmpty()) continue;
            
            String city = booking.getShowSeats().get(0).getShowtime().getRoom().getCinema().getCity();
            double revenue = booking.getOriginalAmount() - booking.getDiscountAmount();
            
            cityRevenueMap.put(city, cityRevenueMap.getOrDefault(city, 0.0) + revenue);
            cityBookingsMap.put(city, cityBookingsMap.getOrDefault(city, 0) + 1);
        }

        List<RevenueStatsResponse.CityRevenue> revenueByCity = cityRevenueMap.entrySet().stream()
                .map(e -> new RevenueStatsResponse.CityRevenue(
                        e.getKey(), 
                        e.getValue(), 
                        cityBookingsMap.get(e.getKey())
                ))
                .sorted((a, b) -> Double.compare(b.getRevenue(), a.getRevenue()))
                .collect(Collectors.toList());

        // Revenue by Cinema
        Map<Long, RevenueStatsResponse.CinemaRevenue> cinemaRevenueMap = new HashMap<>();
        
        for (Booking booking : filteredBookings) {
            if (booking.getShowSeats() == null || booking.getShowSeats().isEmpty()) continue;
            
            var cinema = booking.getShowSeats().get(0).getShowtime().getRoom().getCinema();
            double revenue = booking.getOriginalAmount() - booking.getDiscountAmount();
            
            cinemaRevenueMap.compute(cinema.getId(), (id, existing) -> {
                if (existing == null) {
                    return new RevenueStatsResponse.CinemaRevenue(
                            cinema.getId(),
                            cinema.getName(),
                            cinema.getCity(),
                            revenue,
                            1
                    );
                } else {
                    existing.setRevenue(existing.getRevenue() + revenue);
                    existing.setBookings(existing.getBookings() + 1);
                    return existing;
                }
            });
        }

        List<RevenueStatsResponse.CinemaRevenue> revenueByCinema = new ArrayList<>(cinemaRevenueMap.values());
        revenueByCinema.sort((a, b) -> Double.compare(b.getRevenue(), a.getRevenue()));

        // Revenue by Movie
        Map<Long, RevenueStatsResponse.MovieRevenue> movieRevenueMap = new HashMap<>();
        
        for (Booking booking : filteredBookings) {
            if (booking.getShowSeats() == null || booking.getShowSeats().isEmpty()) continue;
            
            var movie = booking.getShowSeats().get(0).getShowtime().getMovie();
            double revenue = booking.getOriginalAmount() - booking.getDiscountAmount();
            int tickets = booking.getShowSeats().size();
            
            movieRevenueMap.compute(movie.getId(), (id, existing) -> {
                if (existing == null) {
                    return new RevenueStatsResponse.MovieRevenue(
                            movie.getId(),
                            movie.getTitle(),
                            revenue,
                            tickets
                    );
                } else {
                    existing.setRevenue(existing.getRevenue() + revenue);
                    existing.setTickets(existing.getTickets() + tickets);
                    return existing;
                }
            });
        }

        List<RevenueStatsResponse.MovieRevenue> revenueByMovie = new ArrayList<>(movieRevenueMap.values());
        revenueByMovie.sort((a, b) -> Double.compare(b.getRevenue(), a.getRevenue()));

        return new RevenueStatsResponse(
                totalRevenue,
                totalBookings,
                totalTickets,
                revenueByCity,
                revenueByCinema,
                revenueByMovie
        );
    }
}
