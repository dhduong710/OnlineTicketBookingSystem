package com.group7.cinema_backend.repository;
import com.group7.cinema_backend.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
public interface ProductRepository extends JpaRepository<Product, Long> {}