package com.group7.cinema_backend.dto;
import lombok.Data;

@Data
public class LoginRequest {
    private String email;    // Customer đăng nhập bằng Email
    private String password; 
}