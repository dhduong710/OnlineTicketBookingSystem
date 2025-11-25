package com.group7.cinema_backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // Áp dụng cho tất cả các đường dẫn API
                .allowedOrigins("http://localhost:5173") // Chỉ cho phép React Frontend truy cập
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // Cho phép các method này
                .allowedHeaders("*") // Cho phép mọi header
                .allowCredentials(true); // Cho phép gửi cookie/credential nếu cần
    }
}