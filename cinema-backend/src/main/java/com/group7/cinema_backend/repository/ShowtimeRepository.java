package com.group7.cinema_backend.repository;

import com.group7.cinema_backend.entity.Showtime;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ShowtimeRepository extends JpaRepository<Showtime, Long> {
    
    // Tìm suất chiếu theo ID Phim và Ngày chiếu (để hiển thị lên web)
    // Sắp xếp theo giờ chiếu tăng dần
    @Query("SELECT s FROM Showtime s WHERE s.movie.id = :movieId AND s.showDate = :date ORDER BY s.startTime ASC")
    List<Showtime> findShowtimesByMovieAndDate(Long movieId, LocalDate date);

    // Tìm suất chiếu theo ID Rạp và Ngày chiếu (để hiển thị lên trang chi tiết rạp)
    // Sắp xếp theo Tên Phim (tăng dần) và Giờ chiếu (tăng dần)
    @Query("SELECT s FROM Showtime s WHERE s.room.cinema.id = :cinemaId AND s.showDate = :date ORDER BY s.movie.title ASC, s.startTime ASC")
    List<Showtime> findShowtimesByCinemaAndDate(Long cinemaId, LocalDate date);
}
