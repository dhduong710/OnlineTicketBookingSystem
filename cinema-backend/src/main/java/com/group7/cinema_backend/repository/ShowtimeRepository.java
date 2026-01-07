package com.group7.cinema_backend.repository;

import com.group7.cinema_backend.entity.Showtime;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ShowtimeRepository extends JpaRepository<Showtime, Long> {
    
    // Tìm suất chiếu theo Phim và Ngày
    @Query("SELECT s FROM Showtime s WHERE s.movie.id = :movieId AND s.showDate = :date ORDER BY s.startTime ASC")
    List<Showtime> findShowtimesByMovieAndDate(Long movieId, LocalDate date);

    // Tìm suất chiếu theo Rạp và Ngày
    @Query("SELECT s FROM Showtime s WHERE s.room.cinema.id = :cinemaId AND s.showDate = :date ORDER BY s.movie.title ASC, s.startTime ASC")
    List<Showtime> findShowtimesByCinemaAndDate(Long cinemaId, LocalDate date);
}