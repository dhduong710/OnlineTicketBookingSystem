package com.group7.cinema_backend.service;

import com.group7.cinema_backend.dto.MovieScheduleRequest;
import com.group7.cinema_backend.dto.MovieScheduleResponse;
import com.group7.cinema_backend.entity.*;
import com.group7.cinema_backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class MovieScheduleService {

    private final MovieRepository movieRepository;
    private final GenreRepository genreRepository;
    private final ShowtimeRepository showtimeRepository;
    private final RoomRepository roomRepository;
    private final ShowSeatRepository showSeatRepository;
    private final SeatTemplateRepository seatTemplateRepository;

    @Transactional
    public MovieScheduleResponse createMovieWithSchedule(MovieScheduleRequest request) {
        // 1. Tạo Movie mới
        Movie movie = new Movie();
        movie.setTitle(request.getTitle());
        movie.setSummary(request.getSummary());
        movie.setDuration(request.getDuration());
        movie.setPosterUrl(request.getPosterUrl());
        movie.setTrailerUrl(request.getTrailerUrl());
        movie.setReleaseDate(request.getReleaseDate());

        // Gán genres
        if (request.getGenreIds() != null && !request.getGenreIds().isEmpty()) {
            Set<Genre> genres = new HashSet<>(genreRepository.findAllById(request.getGenreIds()));
            movie.setGenres(genres);
        }

        // Save movie
        Movie savedMovie = movieRepository.save(movie);

        // 2. Tạo showtimes hàng loạt
        int showtimesCount = 0;

        for (Long cinemaId : request.getCinemaIds()) {
            // Lấy tất cả phòng của rạp này
            List<Room> rooms = roomRepository.findByCinemaId(cinemaId);
            
            if (rooms.isEmpty()) {
                continue; // Bỏ qua rạp không có phòng
            }

            // Tạo showtime cho mỗi ngày
            for (LocalDate showDate : request.getShowDates()) {
                // Tạo showtime cho mỗi khung giờ
                for (MovieScheduleRequest.ShowtimeSlot slot : request.getShowtimeSlots()) {
                    // Chọn phòng dựa trên format
                    Room room = selectRoomByFormat(rooms, slot.getFormat());
                    
                    if (room == null) {
                        System.out.println("Không tìm thấy phòng phù hợp cho format " + slot.getFormat() + " tại rạp " + cinemaId);
                        continue; // Bỏ qua nếu không tìm thấy phòng phù hợp
                    }
                    
                    Showtime showtime = new Showtime();
                    showtime.setMovie(savedMovie);
                    showtime.setRoom(room);
                    showtime.setShowDate(showDate);
                    showtime.setStartTime(slot.getStartTime());
                    showtime.setFormat(slot.getFormat());

                    Showtime savedShowtime = showtimeRepository.save(showtime);

                    // Tạo ghế cho showtime này dựa trên seat template
                    createShowSeats(savedShowtime, room);

                    showtimesCount++;
                }
            }
        }

        return new MovieScheduleResponse(
                savedMovie.getId(),
                savedMovie.getTitle(),
                showtimesCount,
                "Đã tạo phim và " + showtimesCount + " suất chiếu thành công!"
        );
    }

    /**
     * Chọn phòng phù hợp dựa trên format (2D hoặc 3D)
     * - 2D: Phòng 1 hoặc Phòng 2 (100 ghế - 10 hàng)
     * - 3D: Phòng 3 (120 ghế - 12 hàng)
     */
    private Room selectRoomByFormat(List<Room> rooms, String format) {
        if ("3D".equalsIgnoreCase(format)) {
            // Tìm phòng 3 (phòng 3D)
            return rooms.stream()
                    .filter(r -> r.getName().contains("3") || r.getName().toLowerCase().contains("3d"))
                    .findFirst()
                    .orElse(null);
        } else {
            // 2D: Tìm phòng 1 hoặc 2 (ưu tiên phòng 1)
            return rooms.stream()
                    .filter(r -> r.getName().contains("1") || r.getName().contains("2"))
                    .filter(r -> !r.getName().contains("3")) // Loại trừ phòng 3
                    .findFirst()
                    .orElse(null);
        }
    }

    private void createShowSeats(Showtime showtime, Room room) {
        // Lấy template ghế của phòng cụ thể
        List<SeatTemplate> templates = seatTemplateRepository.findByRoomId(room.getId());
        
        // Tính giá cơ bản dựa trên format
        double basePrice = "3D".equalsIgnoreCase(showtime.getFormat()) ? 70000 : 50000;
        
        for (SeatTemplate template : templates) {
            ShowSeat showSeat = new ShowSeat();
            showSeat.setShowtime(showtime);
            showSeat.setSeatTemplate(template);
            showSeat.setStatus("AVAILABLE");
            
            // Tính giá ghế: VIP (2 hàng cuối) = basePrice + 20000, Standard = basePrice
            String seatNumber = template.getSeatNumber();
            String row = seatNumber.replaceAll("[0-9]", ""); // Lấy hàng (A, B, C...)
            boolean isVIP = row.equals("I") || row.equals("J") || row.equals("K") || row.equals("L");
            double seatPrice = isVIP ? basePrice + 20000 : basePrice;
            
            showSeat.setSoldPrice(seatPrice);
            showSeatRepository.save(showSeat);
        }
    }
}
