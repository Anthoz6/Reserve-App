package com.anthonycorp.reservapp.Mail.domain.Request;

import com.anthonycorp.reservapp.Reservation.domain.status.ReservationStatus;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReservationNotificationRequestDto {
    private String recipientEmail;
    private String customerName;
    private String providerName;
    private String serviceName;
    private ReservationStatus status;
}
