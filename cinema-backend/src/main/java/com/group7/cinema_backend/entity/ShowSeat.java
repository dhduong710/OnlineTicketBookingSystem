package com.group7.cinema_backend.entity;

import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
@Table(name = "showseat")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class ShowSeat {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "show_seat_id")
    private Long id;

    @Column(nullable = false)
    private String status; // Available, Reserved, Sold

    @Column(name = "sold_price", nullable = false)
    private double soldPrice;

    @ManyToOne
    @JoinColumn(name = "seat_template_id", nullable = false)
    private SeatTemplate seatTemplate;

    @ManyToOne
    @JoinColumn(name = "showtime_id", nullable = false)
    private Showtime showtime;

    @ManyToOne
    @JoinColumn(name = "booking_id")
    @JsonBackReference
    private Booking booking;
}