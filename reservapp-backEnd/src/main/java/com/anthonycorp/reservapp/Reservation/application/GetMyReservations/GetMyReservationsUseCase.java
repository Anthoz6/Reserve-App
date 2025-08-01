package com.anthonycorp.reservapp.Reservation.application.GetMyReservations;

import com.anthonycorp.reservapp.Reservation.domain.response.ReservationResponseDto;

import java.util.List;

public interface GetMyReservationsUseCase {
    List<ReservationResponseDto> getReservationAsCustomer(String email);
}
