package com.anthonycorp.reservapp.Reservation.application.UpdateReservationDateTime;

import com.anthonycorp.reservapp.Reservation.domain.response.ReservationResponseDto;

import java.time.LocalDate;
import java.time.LocalTime;

public interface UpdateReservationDateTimeUseCase {
    ReservationResponseDto execute(Long reservationId, LocalDate newDate, LocalTime newTime, String customerEmail);
}
