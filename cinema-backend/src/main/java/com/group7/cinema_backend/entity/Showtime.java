package com.group7.cinema_backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "showtime")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Showtime {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "showtime_id")
    private Long id;

    @Column(nullable = false)
    private String format; 

    @Column(name = "show_date", nullable = false)
    private LocalDate showDate; 

    @Column(name = "start_time", nullable = false)
    private LocalTime startTime; 

    // Quan hệ: Suất chiếu thuộc về 1 Phim
    @ManyToOne
    @JoinColumn(name = "movie_id", nullable = false)
    private Movie movie;

    // Quan hệ: Suất chiếu diễn ra tại 1 Phòng
    @ManyToOne
    @JoinColumn(name = "room_id", nullable = false)
    private Room room;
}