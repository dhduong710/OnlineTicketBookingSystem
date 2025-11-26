package com.group7.cinema_backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "seat")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Seat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "seat_id")
    private Long id;

    @Column(nullable = false)
    private String name; // Ví dụ: A1, A2, B1...

    @Column(name = "row_char", nullable = false)
    private String row; // Ví dụ: A, B, C... 

    @Column(name = "col_number", nullable = false)
    private int col; // Ví dụ: 1, 2, 3... 

    @Column(name = "seat_type", nullable = false)
    private String type; // Các giá trị: "NORMAL", "VIP" (Ghế đôi)

    // Quan hệ: Ghế thuộc về 1 Phòng
    @ManyToOne
    @JoinColumn(name = "room_id", nullable = false)
    private Room room;
}