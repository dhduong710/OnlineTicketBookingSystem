package com.group7.cinema_backend.service;

import com.group7.cinema_backend.dto.CustomerSpendingResponse;
import com.group7.cinema_backend.entity.Booking;
import com.group7.cinema_backend.entity.Customer;
import com.group7.cinema_backend.repository.BookingRepository;
import com.group7.cinema_backend.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CustomerAnalyticsService {

    private final BookingRepository bookingRepository;
    private final CustomerRepository customerRepository;

    public CustomerSpendingResponse getCustomerSpending(String email) {
        // Tìm customer theo email
        Customer customer = customerRepository.findByEmail(email)
                .orElse(null);
        
        if (customer == null) {
            return null;
        }

        // Lấy tất cả booking đã thanh toán của customer
        List<Booking> bookings = bookingRepository.findByCustomer_EmailOrderByIdDesc(email)
                .stream()
                .filter(b -> "Paid".equalsIgnoreCase(b.getPaymentStatus()))
                .collect(Collectors.toList());

        double totalSpending = bookings.stream()
                .mapToDouble(b -> b.getOriginalAmount() - b.getDiscountAmount())
                .sum();

        int totalBookings = bookings.size();

        int totalTickets = bookings.stream()
                .mapToInt(b -> b.getShowSeats() != null ? b.getShowSeats().size() : 0)
                .sum();

        return new CustomerSpendingResponse(
                customer.getEmail(),
                totalSpending,
                totalBookings,
                totalTickets
        );
    }

    public List<CustomerSpendingResponse> getTopCustomers(int limit) {
        // Lấy tất cả booking đã thanh toán
        List<Booking> allBookings = bookingRepository.findAll().stream()
                .filter(b -> "Paid".equalsIgnoreCase(b.getPaymentStatus()))
                .collect(Collectors.toList());

        // Group by customer và tính tổng
        Map<String, CustomerSpendingResponse> customerMap = new HashMap<>();

        for (Booking booking : allBookings) {
            Customer customer = booking.getCustomer();
            String email = customer.getEmail();
            
            double spending = booking.getOriginalAmount() - booking.getDiscountAmount();
            int tickets = booking.getShowSeats() != null ? booking.getShowSeats().size() : 0;

            customerMap.compute(email, (key, existing) -> {
                if (existing == null) {
                    return new CustomerSpendingResponse(
                            email,
                            spending,
                            1,
                            tickets
                    );
                } else {
                    existing.setTotalSpending(existing.getTotalSpending() + spending);
                    existing.setTotalBookings(existing.getTotalBookings() + 1);
                    existing.setTotalTickets(existing.getTotalTickets() + tickets);
                    return existing;
                }
            });
        }

        // Sort by total spending và lấy top N
        List<CustomerSpendingResponse> result = new ArrayList<>(customerMap.values());
        result.sort((a, b) -> Double.compare(b.getTotalSpending(), a.getTotalSpending()));
        
        return result.stream()
                .limit(limit)
                .collect(Collectors.toList());
    }
}