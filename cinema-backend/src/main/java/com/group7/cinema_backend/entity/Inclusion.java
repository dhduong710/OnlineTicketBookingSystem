package com.group7.cinema_backend.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "inclusion")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Inclusion {
    @EmbeddedId
    private InclusionId id = new InclusionId();

    @ManyToOne
    @MapsId("bookingId")
    @JoinColumn(name = "booking_id")
    @JsonBackReference
    private Booking booking;

    @ManyToOne
    @MapsId("productId")
    @JoinColumn(name = "product_id")
    private Product product;

    @Column(name = "product_quantity")
    private int quantity; 
}