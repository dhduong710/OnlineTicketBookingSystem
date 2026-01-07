package com.group7.cinema_backend.config;

import com.group7.cinema_backend.service.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String userEmail;

        // 1. Nếu không có token, cho qua (để vào các API public)
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        jwt = authHeader.substring(7);
        
        try {
            userEmail = jwtService.extractUsername(jwt);
            
            // 2. Nếu lấy được email và chưa xác thực
            if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                
                // --- THÊM TRY-CATCH TẠI ĐÂY ---
                try {
                    UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);

                    if (jwtService.isTokenValid(jwt, userDetails)) {
                        // Extract role từ token
                        
    
                        // Tạo authentication với role
                        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities()
            );
                        authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                        SecurityContextHolder.getContext().setAuthentication(authToken);
            }
                } catch (Exception e) {
                    // Nếu không tìm thấy User (do DB reset) hoặc lỗi khác:
                    // Ta KHÔNG làm gì cả, cứ để filterChain chạy tiếp.
                    // Spring Security sẽ tự chặn ở các endpoint cần quyền sau.
                    System.out.println("Token invalid or User not found: " + e.getMessage());
                }
            }
        } catch (Exception e) {
            // Lỗi extract token cũng cho qua luôn
        }

        filterChain.doFilter(request, response);
    }
}