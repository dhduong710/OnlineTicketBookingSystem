package com.group7.cinema_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MovieScheduleRequest {
    // Thông tin phim
    private String title;
    private String summary;
    private Integer duration;
    private String posterUrl;
    private String trailerUrl;
    private LocalDate releaseDate;
    
    // IDs cho relationships
    private List<Long> genreIds;
    
    // Lịch chiếu hàng loạt
    private List<String> cities;           // Danh sách tỉnh thành
    private List<Long> cinemaIds;          // Danh sách rạp (thuộc các tỉnh đã chọn)
    private List<LocalDate> showDates;     // Danh sách ngày chiếu
    private List<ShowtimeSlot> showtimeSlots; // Danh sách khung giờ chiếu
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ShowtimeSlot {
        private LocalTime startTime;
        private String format; // 2D, 3D
    }
}
