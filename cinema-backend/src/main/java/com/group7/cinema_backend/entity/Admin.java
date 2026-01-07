package com.group7.cinema_backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "admin")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Admin {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "admin_id")
    private Long id;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false)
    private String password;
}