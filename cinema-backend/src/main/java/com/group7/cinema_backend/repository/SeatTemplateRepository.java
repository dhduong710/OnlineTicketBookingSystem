package com.group7.cinema_backend.repository;

import com.group7.cinema_backend.entity.SeatTemplate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SeatTemplateRepository extends JpaRepository<SeatTemplate, Long> {
    // Tìm tất cả ghế mẫu của một phòng (VD: Phòng 1 có ghế A1...F10)
    List<SeatTemplate> findByRoomId(Long roomId);
}