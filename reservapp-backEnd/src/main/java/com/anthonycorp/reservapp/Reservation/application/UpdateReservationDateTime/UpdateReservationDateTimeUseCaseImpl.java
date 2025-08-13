package com.anthonycorp.reservapp.Reservation.application.UpdateReservationDateTime;

import com.anthonycorp.reservapp.Reservation.domain.response.ReservationResponseDto;
import com.anthonycorp.reservapp.Reservation.domain.status.ReservationStatus;
import com.anthonycorp.reservapp.Reservation.infrastructure.exception.ReservationNotFoundException;
import com.anthonycorp.reservapp.Reservation.infrastructure.mapper.ReservationMapper;
import com.anthonycorp.reservapp.Reservation.infrastructure.model.ReservationEntity;
import com.anthonycorp.reservapp.Reservation.infrastructure.repository.ReservationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;

@Service
@RequiredArgsConstructor
public class UpdateReservationDateTimeUseCaseImpl implements UpdateReservationDateTimeUseCase {

    private final ReservationRepository reservationRepository;
    private final ReservationMapper reservationMapper;

    @Override
    public ReservationResponseDto execute(Long reservationId, LocalDate newDate, LocalTime newTime, String customerEmail) {

        if (reservationId == null || newDate == null || newTime == null || customerEmail == null) {
            throw new IllegalArgumentException("Todos los parámetros son requeridos");
        }

        ReservationEntity reservation = reservationRepository.findByIdAndCustomerEmail(reservationId, customerEmail)
                .orElseThrow(() -> new ReservationNotFoundException("Reservation not found with ID: " + reservationId + " for customer: " + customerEmail));

        if (!reservation.getStatus().equals(ReservationStatus.PENDING)) {
            throw new IllegalStateException("Reservation cannot be updated as it is not in PENDING state.");
        }

        // Check if the new date and time are in the future
        validateDateAndTime(newDate, newTime);

        reservation.setDate(newDate);
        reservation.setTime(newTime);

        ReservationEntity updatedReservation = reservationRepository.save(reservation);

        return reservationMapper.toDto(updatedReservation);

    }

    private void validateDateAndTime(LocalDate newDate, LocalTime newTime) {
        LocalDate today = LocalDate.now();
        LocalTime now = LocalTime.now();

        if (newDate.isBefore(today) || (newDate.isEqual(today) && newTime.isBefore(now))) {
            throw new IllegalArgumentException("New date and time must be in the future.");
        }

        if (newDate.equals(today)) {
            if (newTime.isBefore(now.plusHours(3)) ) {
                throw new IllegalArgumentException("Reservations for the same day must be at least 3 hours in advance.");
            }
        }
    }

}
