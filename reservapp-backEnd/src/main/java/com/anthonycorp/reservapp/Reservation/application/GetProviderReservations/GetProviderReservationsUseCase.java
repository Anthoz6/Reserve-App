package com.anthonycorp.reservapp.Reservation.application.GetProviderReservations;

import com.anthonycorp.reservapp.Reservation.domain.response.ProviderReservationDto;
import com.anthonycorp.reservapp.Reservation.domain.status.ReservationStatus;

import java.util.List;

public interface GetProviderReservationsUseCase {
    List<ProviderReservationDto> execute(String providerEmail, ReservationStatus status);
}
