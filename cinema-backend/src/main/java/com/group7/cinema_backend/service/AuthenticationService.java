package com.group7.cinema_backend.service;

import com.group7.cinema_backend.dto.AuthResponse;
import com.group7.cinema_backend.dto.LoginRequest;
import com.group7.cinema_backend.dto.RegisterRequest;
import com.group7.cinema_backend.entity.Customer;
import com.group7.cinema_backend.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final CustomerRepository customerRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public Customer register(RegisterRequest request) {
        if (customerRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email đã được sử dụng!");
        }
        if (customerRepository.existsByPhone(request.getPhone())) {
            throw new RuntimeException("Số điện thoại đã được sử dụng!");
        }

        Customer newCustomer = new Customer();
        newCustomer.setEmail(request.getEmail());
        newCustomer.setPhone(request.getPhone());
        newCustomer.setPassword(passwordEncoder.encode(request.getPassword()));

        return customerRepository.save(newCustomer);
    }

    public AuthResponse login(LoginRequest request) {
        // Xác thực qua Spring Security
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getIdentifier(), // Email hoặc số điện thoại
                        request.getPassword()
                )
        );

        // Tìm user trong DB bằng email hoặc sdt
        var user = customerRepository.findByEmail(request.getIdentifier())
                .or(() -> customerRepository.findByPhone(request.getIdentifier()))
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Tạo Token
        var jwtToken = jwtService.generateToken(user.getEmail(), "ROLE_USER");

        return new AuthResponse(jwtToken);
    }
}