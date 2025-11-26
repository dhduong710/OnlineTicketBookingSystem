package com.group7.cinema_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class SeatResponse {
    private Long id;
    private String name; 
    private String row;  
    private int col;     
    private String type; 
    
    private boolean booked; 
    
    private double price; 
}