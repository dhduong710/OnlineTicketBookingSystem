package com.group7.cinema_backend;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

/**
 * Utility class để generate BCrypt password hash
 * Chạy class này để tạo password hash cho admin
 */
public class PasswordHashGenerator {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        
        // Mật khẩu mặc định cho admin
        String password = "admin123";
        String hashedPassword = encoder.encode(password);
        
        System.out.println("Password: " + password);
        System.out.println("Hashed Password: " + hashedPassword);
        System.out.println("\nSQL Insert Statement:");
        System.out.println("INSERT INTO admin (username, password) VALUES ('admin', '" + hashedPassword + "');");
    }
}
