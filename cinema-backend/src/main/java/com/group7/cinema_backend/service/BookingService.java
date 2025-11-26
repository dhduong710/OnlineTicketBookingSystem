package com.group7.cinema_backend.service;

import com.group7.cinema_backend.dto.BookingRequest;
import com.group7.cinema_backend.entity.*;
import com.group7.cinema_backend.repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

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

    @Transactional // Quan trọng: Nếu có lỗi ở bất kỳ bước nào, nó sẽ rollback (hủy) toàn bộ thao tác để không lỗi dữ liệu
    public Booking createBooking(String userEmail, BookingRequest request) {
        
        // 1. Tìm User đang đặt vé
        Customer customer = customerRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 2. Tìm Suất chiếu
        Showtime showtime = showtimeRepository.findById(request.getShowtimeId())
                .orElseThrow(() -> new RuntimeException("Showtime not found"));

        // 3. Tìm danh sách Ghế từ DB
        List<Seat> seats = seatRepository.findAllById(request.getSeatIds());
        
        // Kiểm tra xem user có gửi ID ghế không hợp lệ
        if (seats.size() != request.getSeatIds().size()) {
            throw new RuntimeException("Có ghế không hợp lệ!");
        }

        // 4. QUAN TRỌNG: Kiểm tra xem ghế đã bị ai đặt chưa?
        // Logic: Lấy tất cả vé đã bán của suất này, xem có trùng ghế không
        List<Ticket> bookedTickets = ticketRepository.findByShowtimeId(showtime.getId());
        for (Ticket ticket : bookedTickets) {
            if (request.getSeatIds().contains(ticket.getSeat().getId())) {
                throw new RuntimeException("Ghế " + ticket.getSeat().getName() + " vừa mới bị người khác đặt!");
            }
        }

        // 5. Tính tổng tiền 
        // 2D = 50k, 3D/IMAX = 80k. VIP + 20k.
        double basePrice = isSpecialFormat(showtime.getFormat()) ? 80000 : 50000;
        double totalAmount = 0;

        for (Seat seat : seats) {
            double seatPrice = basePrice;
            if ("VIP".equalsIgnoreCase(seat.getType())) {
                seatPrice += 20000;
            }
            totalAmount += seatPrice;
        }

        // --- Xử lý logic Giảm giá thêm ở đây sau này ---

        // 6. Tạo Đơn hàng (Booking)
        Booking booking = new Booking();
        booking.setCustomer(customer);
        booking.setShowtime(showtime);
        booking.setBookingTime(LocalDateTime.now());
        booking.setTotalAmount(totalAmount);
        booking.setPaymentStatus("SUCCESS"); // Tạm thời coi như thanh toán luôn thành công

        Booking savedBooking = bookingRepository.save(booking);

        // 7. Tạo Vé (Ticket) cho từng ghế
        for (Seat seat : seats) {
            Ticket ticket = new Ticket();
            ticket.setBooking(savedBooking);
            ticket.setShowtime(showtime);
            ticket.setSeat(seat);
            ticketRepository.save(ticket);
        }

        return savedBooking;
    }

    private boolean isSpecialFormat(String format) {
        return format != null && (format.contains("3D") || format.contains("IMAX"));
    }
}