package com.group7.cinema_backend.dto;
import lombok.Data;

@Data
public class LoginRequest {
    private String identifier;  // Email hoặc số điện thoại
    private String password; 
}