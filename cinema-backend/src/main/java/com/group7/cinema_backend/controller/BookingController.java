package com.group7.cinema_backend.controller;

import com.group7.cinema_backend.dto.BookingRequest;
import com.group7.cinema_backend.entity.Booking;
import com.group7.cinema_backend.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    public ResponseEntity<?> createBooking(@RequestBody BookingRequest request, Authentication authentication) {
        try {
            // Lấy email của người dùng đang đăng nhập từ Token
            String email = authentication.getName();
            
            Booking newBooking = bookingService.createBooking(email, request);
            
            return ResponseEntity.ok("Đặt vé thành công! Mã đơn: " + newBooking.getId());
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}