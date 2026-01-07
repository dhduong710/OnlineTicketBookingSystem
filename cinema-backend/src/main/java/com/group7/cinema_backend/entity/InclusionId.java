package com.group7.cinema_backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.*;
import java.io.Serializable;

@Embeddable
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
@EqualsAndHashCode
public class InclusionId implements Serializable {
    @Column(name = "booking_id")
    private Long bookingId;

    @Column(name = "product_id")
    private Long productId;
}
