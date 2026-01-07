package com.group7.cinema_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CustomerSpendingResponse {
    private String email;
    private double totalSpending;
    private int totalBookings;
    private int totalTickets;
}