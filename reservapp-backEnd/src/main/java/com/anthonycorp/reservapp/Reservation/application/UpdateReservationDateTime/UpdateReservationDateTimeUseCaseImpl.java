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
        ReservationEntity reservation = reservationRepository.findByIdAndCustomerEmail(reservationId, customerEmail)
                .orElseThrow(() -> new ReservationNotFoundException("Reservation not found with ID: " + reservationId + " for customer: " + customerEmail));

        if (!reservation.getStatus().equals(ReservationStatus.PENDING)) {
            throw new IllegalStateException("Reservation cannot be updated as it is not in PENDING state.");
        }

        if (newDate.isBefore(LocalDate.now()) || (newDate.equals(LocalDate.now()) && newTime.isBefore(LocalTime.now()))) {
            throw new IllegalArgumentException("Reservation date and time cannot be in the past.");
        }

        reservation.setDate(newDate);
        reservation.setTime(newTime);

        ReservationEntity updatedReservation = reservationRepository.save(reservation);

        return reservationMapper.toDto(updatedReservation);

    }
}
