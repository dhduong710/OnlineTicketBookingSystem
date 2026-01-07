package com.group7.cinema_backend.service;

import com.group7.cinema_backend.dto.AuthResponse;
import com.group7.cinema_backend.dto.LoginRequest;
import com.group7.cinema_backend.entity.Admin;
import com.group7.cinema_backend.repository.AdminRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final AdminRepository adminRepository;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthResponse login(LoginRequest request) {
        // Xác thực qua Spring Security
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getIdentifier(), // Username
                        request.getPassword()
                )
        );

        // Tìm admin trong DB
        Admin admin = adminRepository.findByUsername(request.getIdentifier())
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        // Tạo Token với role ADMIN
        String jwtToken = jwtService.generateToken(admin.getUsername());

        return new AuthResponse(jwtToken);
    }
}
