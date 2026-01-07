package com.group7.cinema_backend.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class BookingResponse {
    private Long bookingId;
    private double totalAmount;
    private String paymentStatus; // Pending
    
    // Thông tin thanh toán (trả về để FE hiển thị QR)
    private String bankName;
    private String bankAccount;
    private String qrCode; // Nội dung hoặc Link QR
}