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
}
