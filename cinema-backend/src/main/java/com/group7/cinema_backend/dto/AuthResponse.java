package com.group7.cinema_backend.dto;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponse {
    private String token; 
    // Có thể thêm role nếu cần (VD: "ROLE_CUSTOMER")
}