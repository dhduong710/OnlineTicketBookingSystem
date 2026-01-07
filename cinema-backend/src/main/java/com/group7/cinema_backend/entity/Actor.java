package com.group7.cinema_backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "actor")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Actor {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "actor_id")
    private Long id;

    @Column(nullable = false)
    private String name;
}