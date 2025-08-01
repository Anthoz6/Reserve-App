package com.anthonycorp.reservapp.Reservation.application.UpdateReservationStatus;

import com.anthonycorp.reservapp.Reservation.domain.status.ReservationStatus;

public interface UpdateReservationStatusUseCase {
    void execute(Long reservationId, ReservationStatus newStatus, String providerEmail);
}
