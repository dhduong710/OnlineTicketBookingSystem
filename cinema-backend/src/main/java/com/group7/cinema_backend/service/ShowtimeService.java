package com.group7.cinema_backend.service;

import com.group7.cinema_backend.dto.SeatResponse;
import com.group7.cinema_backend.entity.ShowSeat;
import com.group7.cinema_backend.entity.Showtime;
import com.group7.cinema_backend.repository.ShowSeatRepository;
import com.group7.cinema_backend.repository.ShowtimeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ShowtimeService {

    private final ShowtimeRepository showtimeRepository;
    private final ShowSeatRepository showSeatRepository;

    /**
     * Lấy danh sách suất chiếu của một phim vào một ngày cụ thể
     * @param movieId ID của phim
     * @param date Ngày chiếu
     * @return Danh sách Showtime
     */
    public List<Showtime> getShowtimesByMovie(Long movieId, LocalDate date) {
        return showtimeRepository.findShowtimesByMovieAndDate(movieId, date);
    }

    /**
     * Lấy danh sách suất chiếu theo Rạp và Ngày
     */
    public List<Showtime> getShowtimesByCinema(Long cinemaId, LocalDate date) {
        return showtimeRepository.findShowtimesByCinemaAndDate(cinemaId, date);
    }

    /**
     * Lấy danh sách ghế của một suất chiếu, chuyển thành SeatResponse DTO
     * @param showtimeId ID của suất chiếu
     * @return Danh sách SeatResponse (kèm trạng thái và giá)
     */
    public List<SeatResponse> getShowSeats(Long showtimeId) {
        List<ShowSeat> showSeats = showSeatRepository.findByShowtimeId(showtimeId);
        
        return showSeats.stream()
                .map(this::convertToSeatResponse)
                .collect(Collectors.toList());
    }

    /**
     * Chuyển ShowSeat entity sang SeatResponse DTO
     * Tách seatNumber thành row (chữ) và col (số)
     * VD: "A1" -> row="A", col=1
     */
    private SeatResponse convertToSeatResponse(ShowSeat showSeat) {
        String seatNumber = showSeat.getSeatTemplate().getSeatNumber();
        String row = seatNumber.replaceAll("[0-9]", ""); // Lấy phần chữ (A, B, C...)
        int col = Integer.parseInt(seatNumber.replaceAll("[^0-9]", "")); // Lấy phần số
        
        return new SeatResponse(
                showSeat.getId(),
                seatNumber,
                row,
                col,
                showSeat.getStatus(),
                showSeat.getSoldPrice()
        );
    }
}
