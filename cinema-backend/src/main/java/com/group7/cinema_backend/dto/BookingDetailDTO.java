package com.group7.cinema_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingDetailDTO {
    private Long id;
    private double originalAmount;
    private double discountAmount;
    private String paymentStatus;
    
    // Thông tin suất chiếu
    private ShowtimeDTO showtime;
    
    // Danh sách ghế
    private List<String> seatNumbers;
    
    // Danh sách sản phẩm (bắp nước)
    private List<InclusionDTO> inclusions;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ShowtimeDTO {
        private Long id;
        private String startTime;
        private String showDate;
        private String format; // 2D, 3D
        
        private MovieDTO movie;
        private RoomDTO room;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MovieDTO {
        private Long id;
        private String title;
        private String posterUrl;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RoomDTO {
        private Long id;
        private String name;
        private CinemaDTO cinema;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CinemaDTO {
        private Long id;
        private String name;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class InclusionDTO {
        private Long productId;
        private String productName;
        private int quantity;
        private double price;
    }
}
