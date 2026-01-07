package com.group7.cinema_backend.service;

import com.group7.cinema_backend.entity.Movie;
import com.group7.cinema_backend.repository.MovieRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MovieService {

    private final MovieRepository movieRepository;

    /**
     * Lấy tất cả phim đang chiếu
     * @return Danh sách Movie
     */
    public List<Movie> getAllMovies() {
        return movieRepository.findAll();
    }

    /**
     * Lấy phim theo ID
     * @param id ID phim
     * @return Movie
     */
    public Movie getMovieById(Long id) {
        return movieRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Movie not found"));
    }
}
