package com.group7.cinema_backend.repository;

import com.group7.cinema_backend.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {
    // Tìm kiếm user bằng email (dùng khi đăng nhập)
    Optional<Customer> findByEmail(String email);

    // Tìm kiếm user bằng số điện thoại
    Optional<Customer> findByPhone(String phone);
    
    // Kiểm tra xem email đã tồn tại chưa (dùng khi đăng ký)
    boolean existsByEmail(String email);
    
    // Kiểm tra xem SĐT đã tồn tại chưa
    boolean existsByPhone(String phone);
}