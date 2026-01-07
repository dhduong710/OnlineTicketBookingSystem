package com.group7.cinema_backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "director")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Director {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "director_id")
    private Long id;

    @Column(nullable = false)
    private String name;
}