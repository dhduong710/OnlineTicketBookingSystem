package com.group7.cinema_backend.repository;

import com.group7.cinema_backend.entity.Cinema;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CinemaRepository extends JpaRepository<Cinema, Long> {
    @Query("SELECT DISTINCT c.city FROM Cinema c ORDER BY c.city")
    List<String> findDistinctCities();
    
    List<Cinema> findByCity(String city);
}