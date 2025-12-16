package com.group7.cinema_backend.service;

import com.group7.cinema_backend.dto.BookingRequest;
import com.group7.cinema_backend.entity.*;
import com.group7.cinema_backend.repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final TicketRepository ticketRepository;
    private final SeatRepository seatRepository;
    private final ShowtimeRepository showtimeRepository;
    private final CustomerRepository customerRepository;
    private final ProductRepository productRepository;
    private final InclusionRepository inclusionRepository;

    @Transactional 
    public Booking createBooking(String userEmail, BookingRequest request) {
        // 1. Tìm User & Showtime 
        Customer customer = customerRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Showtime showtime = showtimeRepository.findById(request.getShowtimeId())
                .orElseThrow(() -> new RuntimeException("Showtime not found"));

        // 2. Validate & Lock Ghế 
        List<Seat> seats = seatRepository.findAllById(request.getSeatIds());
        List<Ticket> bookedTickets = ticketRepository.findTicketsByShowtimeId(showtime.getId());
        for (Ticket ticket : bookedTickets) {
            if (request.getSeatIds().contains(ticket.getSeat().getId())) {
                throw new RuntimeException("Ghế " + ticket.getSeat().getName() + " đã bị đặt!");
            }
        }

        // 3. TÍNH TIỀN VÉ (Ticket Price)
        double basePrice = isSpecialFormat(showtime.getFormat()) ? 80000 : 50000;
        double totalTicketPrice = 0;
        for (Seat seat : seats) {
            double seatPrice = basePrice;
            if ("VIP".equalsIgnoreCase(seat.getType())) seatPrice += 20000;
            totalTicketPrice += seatPrice;
        }

        // 4. ÁP DỤNG GIẢM GIÁ (Discount Logic) 
        double discountRate = 0.0;
        
        // - Giảm 10% nếu là Thứ 3
        if (showtime.getShowDate().getDayOfWeek() == DayOfWeek.TUESDAY) {
            discountRate += 0.10;
        }
        // - Giảm 10% nếu mua >= 5 vé
        if (seats.size() >= 5) {
            discountRate += 0.10;
        }

        // Công thức: Tổng tiền vé sau giảm = Giá vé gốc * (1 - Tổng % giảm)
        double finalTicketPrice = totalTicketPrice * (1.0 - discountRate);

        // 5. TÍNH TIỀN BẮP NƯỚC (Product Price)
        double totalProductPrice = 0;
        List<Inclusion> inclusionsToSave = new java.util.ArrayList<>();
        
        if (request.getProducts() != null) {
            for (BookingRequest.ProductOrder pOrder : request.getProducts()) {
                if (pOrder.getQuantity() > 0) {
                    Product product = productRepository.findById(pOrder.getProductId())
                            .orElseThrow(() -> new RuntimeException("Product not found"));
                    
                    totalProductPrice += product.getPrice() * pOrder.getQuantity();
                    
                    // Chuẩn bị lưu xuống DB
                    Inclusion inclusion = new Inclusion();
                    inclusion.setProduct(product);
                    inclusion.setQuantity(pOrder.getQuantity());
                    inclusionsToSave.add(inclusion);
                }
            }
        }

        // 6. TỔNG THANH TOÁN CUỐI CÙNG 
        double finalTotalAmount = finalTicketPrice + totalProductPrice;

        // 7. Lưu Booking
        Booking booking = new Booking();
        booking.setCustomer(customer);
        booking.setShowtime(showtime);
        booking.setBookingTime(LocalDateTime.now());
        booking.setTotalAmount(finalTotalAmount);
        booking.setPaymentStatus("SUCCESS"); // Mặc định thành công
        Booking savedBooking = bookingRepository.save(booking);

        // 8. Lưu Vé (Ticket)
        for (Seat seat : seats) {
            Ticket ticket = new Ticket();
            ticket.setBooking(savedBooking);
            ticket.setShowtime(showtime);
            ticket.setSeat(seat);
            ticketRepository.save(ticket);
        }

        // 9. Lưu Bắp Nước (Inclusion)
        for (Inclusion inc : inclusionsToSave) {
            inc.setBooking(savedBooking);
            inclusionRepository.save(inc);
        }

        return savedBooking;
    }

    private boolean isSpecialFormat(String format) {
        return format != null && (format.contains("3D") || format.contains("IMAX"));
    }
}