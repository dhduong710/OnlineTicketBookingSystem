package com.group7.cinema_backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "cinema")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Cinema {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "cinema_id")
    private Long id;

    @Column(nullable = false)
    private String name; 

    @Column(nullable = false)
    private String city; 
    
    @Column(name = "image_url")
    private String imageUrl; 
    
    @Column(name = "address")
    private String address; 
}