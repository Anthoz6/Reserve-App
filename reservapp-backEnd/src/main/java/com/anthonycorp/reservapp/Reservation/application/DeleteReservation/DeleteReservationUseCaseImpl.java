package com.anthonycorp.reservapp.Reservation.application.DeleteReservation;

import com.anthonycorp.reservapp.Reservation.domain.status.ReservationStatus;
import com.anthonycorp.reservapp.Reservation.infrastructure.exception.ReservationNotFoundException;
import com.anthonycorp.reservapp.Reservation.infrastructure.model.ReservationEntity;
import com.anthonycorp.reservapp.Reservation.infrastructure.repository.ReservationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DeleteReservationUseCaseImpl implements DeleteReservationUseCase {

    private final ReservationRepository reservationRepository;

    @Override
    public void execute(Long reservationId, String customerEmail) {
        ReservationEntity reservation = reservationRepository.findByIdAndCustomerEmail(reservationId, customerEmail)
                .orElseThrow(() -> new ReservationNotFoundException("Reservation not found for ID: " + reservationId + " and customer email: " + customerEmail));

        if (!reservation.getStatus().equals(ReservationStatus.PENDING)) {
            throw new IllegalStateException("Reservation cannot be deleted as it is not in PENDING state.");
        }

        reservationRepository.delete(reservation);
    }
}
