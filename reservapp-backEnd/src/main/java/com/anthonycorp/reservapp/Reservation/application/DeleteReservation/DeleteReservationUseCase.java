package com.anthonycorp.reservapp.Reservation.application.DeleteReservation;

public interface DeleteReservationUseCase {
    void execute(Long reservationId, String customerEmail);
}
