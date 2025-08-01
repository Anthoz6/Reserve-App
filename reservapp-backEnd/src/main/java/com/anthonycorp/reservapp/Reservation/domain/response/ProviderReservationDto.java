package com.anthonycorp.reservapp.Reservation.domain.response;

import com.anthonycorp.reservapp.Reservation.domain.status.ReservationStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ProviderReservationDto {
    private Long id;
    private String customerName;
    private String customerEmail;
    private String serviceName;
    private LocalDateTime reservationDateTime;
    private ReservationStatus status;
    private String notes;
}

