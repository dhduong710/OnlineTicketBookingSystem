package com.group7.cinema_backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "cinema")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Cinema {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "cinema_id")
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String city;
    
    @Column(length = 500)
    private String address;
    
    @Column(name = "image_url", length = 500)
    private String imageUrl;
}