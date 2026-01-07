package com.group7.cinema_backend.dto;

import lombok.Data;
import java.util.List;

@Data
public class BookingRequest {
    private Long showtimeId;      
    
    // Danh sách show_seat_id (ID của ghế trong suất chiếu, KHÔNG phải seat_template_id)
    private List<Long> showSeatIds;   

    private List<ProductOrder> products;

    @Data
    public static class ProductOrder {
        private Long productId;
        private int quantity;
    }
}