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

            // Dùng phòng đầu tiên (có thể cải thiện logic này)
            Room room = rooms.get(0);

            // Tạo showtime cho mỗi ngày
            for (LocalDate showDate : request.getShowDates()) {
                // Tạo showtime cho mỗi khung giờ
                for (MovieScheduleRequest.ShowtimeSlot slot : request.getShowtimeSlots()) {
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

    private void createShowSeats(Showtime showtime, Room room) {
        // Lấy template ghế của phòng (giả sử mỗi phòng có template riêng)
        List<SeatTemplate> templates = seatTemplateRepository.findAll();
        
        for (SeatTemplate template : templates) {
            ShowSeat showSeat = new ShowSeat();
            showSeat.setShowtime(showtime);
            showSeat.setSeatTemplate(template);
            showSeat.setStatus("AVAILABLE");
            showSeatRepository.save(showSeat);
        }
    }
}
