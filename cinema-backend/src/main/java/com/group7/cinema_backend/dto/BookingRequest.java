package com.group7.cinema_backend.dto;

import lombok.Data;
import java.util.List;

@Data
public class BookingRequest {
    private Long showtimeId;      // Đặt cho suất chiếu nào
    private List<Long> seatIds;   // Danh sách ID các ghế muốn đặt
}