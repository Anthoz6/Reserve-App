package com.anthonycorp.reservapp.Reservation.application.UpdateReservationStatus;

import com.anthonycorp.reservapp.Mail.application.ReservationMailNotification.ReservationMailNotificationUseCase;
import com.anthonycorp.reservapp.Mail.domain.Request.ReservationNotificationRequestDto;
import com.anthonycorp.reservapp.Reservation.domain.status.ReservationStatus;
import com.anthonycorp.reservapp.Reservation.infrastructure.exception.ReservationNotFoundException;
import com.anthonycorp.reservapp.Reservation.infrastructure.model.ReservationEntity;
import com.anthonycorp.reservapp.Reservation.infrastructure.repository.ReservationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UpdateReservationStatusUseCaseImpl implements UpdateReservationStatusUseCase {

    private final ReservationRepository reservationRepository;
    private final ReservationMailNotificationUseCase reservationMailNotificationUseCase;

    @Override
    public void execute(Long reservationId, ReservationStatus newStatus, String providerEmail) {
        ReservationEntity reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new ReservationNotFoundException("Reservation not found with ID: " + reservationId));

        if (!reservation.getService().getProvider().getEmail().contains(providerEmail)) {
            throw new IllegalArgumentException("Provider email does not match the reservation's service provider.");
        }

        reservation.setStatus(newStatus);
        reservationRepository.save(reservation);

        ReservationNotificationRequestDto customerNotification = ReservationNotificationRequestDto.builder()
                .recipientEmail(reservation.getCustomer().getEmail())
                .customerName(reservation.getCustomer().getName())
                .providerName(reservation.getService().getProvider().getName())
                .serviceName(reservation.getService().getTitle())
                .status(newStatus)
                .build();

        reservationMailNotificationUseCase.sendReservationStatusUpdateToCustomer(customerNotification);


    }
}
