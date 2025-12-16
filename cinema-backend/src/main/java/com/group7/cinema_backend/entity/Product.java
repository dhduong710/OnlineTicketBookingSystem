package com.group7.cinema_backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "product")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Product {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "product_id")
    private Long id;

    private String name;  // Bắp, Nước, Combo
    private double price; // 50k, 20k, 65k
    private String imageUrl; // Link ảnh minh họa
}