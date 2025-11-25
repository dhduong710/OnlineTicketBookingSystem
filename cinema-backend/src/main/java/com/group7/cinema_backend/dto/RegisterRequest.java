package com.group7.cinema_backend.dto;

import lombok.Data;

@Data
public class RegisterRequest {
    private String email;
    private String phone;
    private String password;
}