package com.group7.cinema_backend.entity;

import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import java.util.List;

@Entity
@Table(name = "booking")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Booking {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "booking_id")
    private Long id;

    @Column(name = "original_amount", nullable = false)
    private double originalAmount;

    @Column(name = "discount_amount")
    private double discountAmount;

    @Column(name = "payment_status")
    private String paymentStatus; // Pending, Paid

    @ManyToOne
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    @OneToMany(mappedBy = "booking")
    @JsonManagedReference
    private List<ShowSeat> showSeats;

    @OneToMany(mappedBy = "booking")
    @JsonManagedReference
    private List<Inclusion> inclusions;
    
    @OneToOne(mappedBy = "booking")
    private Payment payment;
}