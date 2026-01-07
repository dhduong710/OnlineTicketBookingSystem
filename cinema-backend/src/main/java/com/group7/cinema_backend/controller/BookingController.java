package com.group7.cinema_backend.controller;

import com.group7.cinema_backend.dto.BookingRequest;
import com.group7.cinema_backend.dto.BookingResponse;
import com.group7.cinema_backend.dto.BookingDetailDTO;
import com.group7.cinema_backend.entity.Booking;
import com.group7.cinema_backend.entity.ShowSeat;
import com.group7.cinema_backend.entity.Showtime;
import com.group7.cinema_backend.repository.BookingRepository;
import com.group7.cinema_backend.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;
    private final BookingRepository bookingRepository;

    @PostMapping
    public ResponseEntity<?> createBooking(@RequestBody BookingRequest request, Authentication authentication) {
        try {
            String email = authentication.getName();
            
            // Service trả về BookingResponse (có thông tin thanh toán & QR)
            BookingResponse response = bookingService.createBooking(email, request);
            
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/my-bookings")
    public ResponseEntity<List<BookingDetailDTO>> getMyBookings(Authentication authentication) {
        String email = authentication.getName();
        
        // SỬA: Dùng phương thức OrderByIdDesc (vì DB mới không có bookingTime, dùng ID để biết cái nào mới nhất)
        List<Booking> bookings = bookingRepository.findByCustomer_EmailOrderByIdDesc(email);
        
        // Convert to DTO to avoid circular reference
        List<BookingDetailDTO> dtos = bookings.stream().map(booking -> {
            ShowSeat firstSeat = booking.getShowSeats().isEmpty() ? null : booking.getShowSeats().get(0);
            Showtime showtime = firstSeat != null ? firstSeat.getShowtime() : null;
            
            if (showtime == null) {
                return null;
            }
            
            // Map Showtime
            BookingDetailDTO.ShowtimeDTO showtimeDTO = BookingDetailDTO.ShowtimeDTO.builder()
                    .id(showtime.getId())
                    .startTime(showtime.getStartTime().toString())
                    .showDate(showtime.getShowDate().toString())
                    .format(showtime.getFormat())
                    .movie(BookingDetailDTO.MovieDTO.builder()
                            .id(showtime.getMovie().getId())
                            .title(showtime.getMovie().getTitle())
                            .posterUrl(showtime.getMovie().getPosterUrl())
                            .build())
                    .room(BookingDetailDTO.RoomDTO.builder()
                            .id(showtime.getRoom().getId())
                            .name(showtime.getRoom().getName())
                            .cinema(BookingDetailDTO.CinemaDTO.builder()
                                    .id(showtime.getRoom().getCinema().getId())
                                    .name(showtime.getRoom().getCinema().getName())
                                    .build())
                            .build())
                    .build();
            
            // Map seat numbers
            List<String> seatNumbers = booking.getShowSeats().stream()
                    .map(seat -> seat.getSeatTemplate().getSeatNumber())
                    .toList();
            
            // Map inclusions
            List<BookingDetailDTO.InclusionDTO> inclusionDTOs = booking.getInclusions().stream()
                    .map(inc -> BookingDetailDTO.InclusionDTO.builder()
                            .productId(inc.getProduct().getId())
                            .productName(inc.getProduct().getName())
                            .quantity(inc.getQuantity())
                            .price(inc.getProduct().getPrice())
                            .build())
                    .toList();
            
            return BookingDetailDTO.builder()
                    .id(booking.getId())
                    .originalAmount(booking.getOriginalAmount())
                    .discountAmount(booking.getDiscountAmount())
                    .paymentStatus(booking.getPaymentStatus())
                    .showtime(showtimeDTO)
                    .seatNumbers(seatNumbers)
                    .inclusions(inclusionDTOs)
                    .build();
        }).filter(dto -> dto != null).toList();
        
        return ResponseEntity.ok(dtos);
    }
}