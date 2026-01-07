package com.group7.cinema_backend.controller;

import com.group7.cinema_backend.dto.BookingRequest;
import com.group7.cinema_backend.dto.BookingResponse;
import com.group7.cinema_backend.entity.Booking;
import com.group7.cinema_backend.repository.BookingRepository;
import com.group7.cinema_backend.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;
    private final BookingRepository bookingRepository;

    @PostMapping
    public ResponseEntity<?> createBooking(@RequestBody BookingRequest request, Authentication authentication) {
        try {
            String email = authentication.getName();
            
            // Service trả về BookingResponse (có thông tin thanh toán & QR)
            BookingResponse response = bookingService.createBooking(email, request);
            
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/my-bookings")
    public ResponseEntity<List<Booking>> getMyBookings(Authentication authentication) {
        String email = authentication.getName();
        
        // SỬA: Dùng phương thức OrderByIdDesc (vì DB mới không có bookingTime, dùng ID để biết cái nào mới nhất)
        List<Booking> bookings = bookingRepository.findByCustomer_EmailOrderByIdDesc(email);
        
        return ResponseEntity.ok(bookings);
    }
}