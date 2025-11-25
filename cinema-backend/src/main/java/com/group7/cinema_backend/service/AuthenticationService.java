package com.group7.cinema_backend.service;

import com.group7.cinema_backend.dto.RegisterRequest;
import com.group7.cinema_backend.entity.Customer;
import com.group7.cinema_backend.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.group7.cinema_backend.dto.AuthResponse; 
import com.group7.cinema_backend.dto.LoginRequest; 
import org.springframework.security.authentication.AuthenticationManager; 
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken; 

@Service
@RequiredArgsConstructor // Lombok tự tạo Constructor cho các field final
public class AuthenticationService {

    private final CustomerRepository customerRepository;
    private final PasswordEncoder passwordEncoder;

    private final JwtService jwtService; 
    private final AuthenticationManager authenticationManager; 

    public Customer register(RegisterRequest request) {
        // 1. Kiểm tra Email đã tồn tại chưa
        if (customerRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email đã được sử dụng!");
        }

        // 2. Kiểm tra Số điện thoại đã tồn tại chưa
        if (customerRepository.existsByPhone(request.getPhone())) {
            throw new RuntimeException("Số điện thoại đã được sử dụng!");
        }

        // 3. Tạo đối tượng Customer mới từ request
        Customer newCustomer = new Customer();
        newCustomer.setEmail(request.getEmail());
        newCustomer.setPhone(request.getPhone());
        
        // 4. Mã hóa mật khẩu trước khi lưu
        String encodedPassword = passwordEncoder.encode(request.getPassword());
        newCustomer.setPassword(encodedPassword);

        // 5. Lưu vào Database
        return customerRepository.save(newCustomer);
    }

    public AuthResponse login(LoginRequest request) {
        // 1. Xác thực username/password
        // Nếu sai pass, hàm này sẽ tự ném lỗi (Exception), code dừng tại đây.
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        // 2. Nếu vượt qua bước trên nghĩa là đăng nhập đúng.
        // Tìm user trong DB để lấy thông tin tạo token
        var user = customerRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found")); // Không tìm thấy dù đã auth thành công 

        // 3. Tạo token
        var jwtToken = jwtService.generateToken(user.getEmail());

        return new AuthResponse(jwtToken);
    }
}