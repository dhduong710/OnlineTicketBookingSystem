package com.group7.cinema_backend.controller;

import com.group7.cinema_backend.dto.RegisterRequest;
import com.group7.cinema_backend.entity.Customer;
import com.group7.cinema_backend.service.AuthenticationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import com.group7.cinema_backend.dto.AuthResponse; 
import com.group7.cinema_backend.dto.LoginRequest; 

@RestController
@RequestMapping("/api/auth") // Tiền tố cho tất cả API trong file này
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationService authenticationService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            Customer registeredCustomer = authenticationService.register(request);
            return ResponseEntity.ok("Registration successful! Customer ID: " + registeredCustomer.getId());
        } catch (RuntimeException e) {
            // Trả về lỗi nếu email/sđt trùng (lỗi 400 Bad Request)
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(authenticationService.login(request));
    }
}