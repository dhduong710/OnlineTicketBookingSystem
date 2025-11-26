package com.group7.cinema_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class SeatResponse {
    private Long id;
    private String name; // A1, A2
    private String row;  // A
    private int col;     // 1
    private String type; // NORMAL, VIP
    private boolean isBooked; // true nếu đã có người đặt
    private double price; // Giá tiền của ghế này
}