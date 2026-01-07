package com.group7.cinema_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class SeatResponse {
    private Long id;           // Đây là show_seat_id (để khi đặt vé thì gửi ID này lên)
    private String seatNumber; // VD: "A1", "B5" (Lấy từ SeatTemplate)
    
    // Các field hỗ trợ Frontend vẽ sơ đồ ghế (Service sẽ tách từ seatNumber)
    private String row;        // VD: "A"
    private int col;           // VD: 1
    
    private String status;     // "Available", "Sold", "Reserved" (Thay cho boolean booked)
    private double price;      // Giá vé (Lấy từ ShowSeat)
}