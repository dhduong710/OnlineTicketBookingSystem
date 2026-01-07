package com.group7.cinema_backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "genre")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Genre {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "genre_id")
    private Long id;

    @Column(nullable = false)
    private String name;
}