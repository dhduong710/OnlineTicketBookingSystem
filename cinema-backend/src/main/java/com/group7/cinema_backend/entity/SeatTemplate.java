package com.group7.cinema_backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "seattemplate")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class SeatTemplate {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "seat_template_id")
    private Long id;

    @Column(name = "seat_number", nullable = false)
    private String seatNumber; // VD: A1, B2

    @ManyToOne
    @JoinColumn(name = "room_id", nullable = false)
    private Room room;
}