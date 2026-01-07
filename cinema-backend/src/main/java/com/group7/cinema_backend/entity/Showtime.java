package com.group7.cinema_backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "showtime")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Showtime {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "showtime_id")
    private Long id;

    @Column(nullable = false)
    private String format; // 2D, 3D

    @Column(name = "start_time", nullable = false)
    private LocalTime startTime;

    @Column(name = "show_date", nullable = false)
    private LocalDate showDate;

    @ManyToOne
    @JoinColumn(name = "movie_id", nullable = false)
    private Movie movie;

    @ManyToOne
    @JoinColumn(name = "room_id", nullable = false)
    private Room room;
}