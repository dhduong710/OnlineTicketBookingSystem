package com.group7.cinema_backend.service;

import com.group7.cinema_backend.dto.BookingRequest;
import com.group7.cinema_backend.dto.BookingResponse;
import com.group7.cinema_backend.entity.*;
import com.group7.cinema_backend.repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class BookingService {

    private final BookingRepository bookingRepository;
    private final ShowSeatRepository showSeatRepository; // Thay cho TicketRepository
    private final CustomerRepository customerRepository;
    private final ProductRepository productRepository;
    private final InclusionRepository inclusionRepository;
    private final PaymentRepository paymentRepository;

    @Transactional
    public BookingResponse createBooking(String userEmail, BookingRequest request) {
        // 1. Tìm User
        Customer customer = customerRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Khách hàng không tồn tại"));

        // 2. Lấy danh sách ShowSeat từ DB và Validate
        List<ShowSeat> selectedSeats = showSeatRepository.findAllById(request.getShowSeatIds());
        
        if (selectedSeats.size() != request.getShowSeatIds().size()) {
            throw new RuntimeException("Một số ghế không hợp lệ!");
        }

        // Kiểm tra xem ghế có còn trống không
        for (ShowSeat seat : selectedSeats) {
            if (!"Available".equalsIgnoreCase(seat.getStatus())) {
                throw new RuntimeException("Ghế " + seat.getSeatTemplate().getSeatNumber() + " đã bị người khác đặt!");
            }
        }

        // Lấy thông tin ShowTime từ ghế đầu tiên (để tính giá cơ bản)
        Showtime showtime = selectedSeats.get(0).getShowtime();

        // 3. TÍNH TIỀN VÉ
        double totalTicketPrice = 0;
        double basePrice = is3DMovie(showtime.getFormat()) ? 70000 : 50000;

        for (ShowSeat seat : selectedSeats) {
            // Logic giá: Giá gốc (Có thể mở rộng logic VIP ở đây nếu SeatTemplate có field Type)
            double seatPrice = basePrice;
            
            // Cập nhật giá bán thực tế vào ShowSeat (để lưu lịch sử giá lúc mua)
            seat.setSoldPrice(seatPrice);
            totalTicketPrice += seatPrice;
        }

        // 4. ÁP DỤNG GIẢM GIÁ
        double discountAmount = 0;
        
        // Giảm 10% nếu thứ 3 (Tuesday)
        if (showtime.getShowDate().getDayOfWeek() == DayOfWeek.TUESDAY) {
            discountAmount += totalTicketPrice * 0.10;
        }
        
        // Giảm 10% khi đặt >= 5 vé
        if (selectedSeats.size() >= 5) {
            discountAmount += totalTicketPrice * 0.10;
        }
        
        //double finalTicketPrice = totalTicketPrice - discountAmount;

        // 5. TÍNH TIỀN BẮP NƯỚC
        double totalProductPrice = 0;
        List<Inclusion> inclusionsToSave = new ArrayList<>();

        if (request.getProducts() != null) {
            for (BookingRequest.ProductOrder pOrder : request.getProducts()) {
                if (pOrder.getQuantity() > 0) {
                    Product product = productRepository.findById(pOrder.getProductId())
                            .orElseThrow(() -> new RuntimeException("Sản phẩm không tồn tại ID: " + pOrder.getProductId()));

                    totalProductPrice += product.getPrice() * pOrder.getQuantity();

                    Inclusion inclusion = new Inclusion();
                    inclusion.setProduct(product);
                    inclusion.setQuantity(pOrder.getQuantity());
                    inclusionsToSave.add(inclusion);
                }
            }
        }

        // 6. LƯU BOOKING (TỔNG ĐƠN)
        Booking booking = new Booking();
        booking.setCustomer(customer);
        // Original Amount = Tổng vé + bắp nước (TRƯỚC khi giảm)
        booking.setOriginalAmount(totalTicketPrice + totalProductPrice);
        // Discount chỉ áp dụng cho vé, không áp dụng cho bắp nước
        booking.setDiscountAmount(discountAmount);
        booking.setPaymentStatus("Pending"); // Chờ thanh toán
        
        System.out.println("=== BOOKING DEBUG ===");
        System.out.println("Total Ticket Price: " + totalTicketPrice);
        System.out.println("Total Product Price: " + totalProductPrice);
        System.out.println("Original Amount: " + booking.getOriginalAmount());
        System.out.println("Discount Amount: " + booking.getDiscountAmount());
        System.out.println("Payment Amount: " + (booking.getOriginalAmount() - booking.getDiscountAmount()));
        System.out.println("===================");
        log.info("Discount applied: {}", booking.getDiscountAmount());;
        
        Booking savedBooking = bookingRepository.save(booking);

        // 7. CẬP NHẬT TRẠNG THÁI GHẾ (Sold) & GÁN VÀO BOOKING
        for (ShowSeat seat : selectedSeats) {
            seat.setStatus("Sold");
            seat.setBooking(savedBooking); // Link ghế với đơn hàng
            showSeatRepository.save(seat);
        }

        // 8. LƯU BẮP NƯỚC
        for (Inclusion inc : inclusionsToSave) {
            inc.setBooking(savedBooking);
            inclusionRepository.save(inc);
        }
        
        // 9. TẠO THÔNG TIN THANH TOÁN (PAYMENT)
        // Đánh dấu đã thanh toán ngay sau khi xác nhận
        savedBooking.setPaymentStatus("Paid");
        bookingRepository.save(savedBooking);

        Payment payment = new Payment();
        payment.setBooking(savedBooking);
        payment.setAmount(savedBooking.getOriginalAmount() - savedBooking.getDiscountAmount());
        payment.setBankName("MB Bank");
        payment.setBankAccount("0987654321");
        // Giả lập QR Code nội dung chuyển khoản
        payment.setQrCode("QR_CODE_DATA_FOR_BOOKING_" + savedBooking.getId());
        
        paymentRepository.save(payment);

        // 10. Trả về kết quả
        return BookingResponse.builder()
                .bookingId(savedBooking.getId())
                .totalAmount(payment.getAmount())
                .paymentStatus(savedBooking.getPaymentStatus())
                .qrCode(payment.getQrCode())
                .bankName(payment.getBankName())
                .bankAccount(payment.getBankAccount())
                .build();
    }

    private boolean is3DMovie(String format) {
        return format != null && format.contains("3D");
    }
}