package com.group7.cinema_backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonManagedReference; 
import java.util.List;

@Entity
@Table(name = "booking")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "booking_id")
    private Long id;

    // Ai là người đặt?
    @ManyToOne
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    // Đặt suất chiếu nào?
    @ManyToOne
    @JoinColumn(name = "showtime_id", nullable = false)
    private Showtime showtime;

    @Column(name = "booking_time", nullable = false)
    private LocalDateTime bookingTime; // Thời gian đặt vé

    @Column(name = "total_amount", nullable = false)
    private double totalAmount; // Tổng tiền (sau khi trừ khuyến mãi nếu có)

    @Column(name = "payment_status")
    private String paymentStatus; // "PENDING" (Chờ thanh toán), "PAID" (Đã trả), "CANCELLED"

    @OneToMany(mappedBy = "booking")
    @JsonManagedReference 
    private List<Ticket> tickets;

    @OneToMany(mappedBy = "booking")
    @JsonManagedReference
    private List<Inclusion> inclusions;
}