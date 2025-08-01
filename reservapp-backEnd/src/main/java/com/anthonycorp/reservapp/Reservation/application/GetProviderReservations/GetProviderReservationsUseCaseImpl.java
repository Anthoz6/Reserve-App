package com.anthonycorp.reservapp.Reservation.application.GetProviderReservations;

import com.anthonycorp.reservapp.Reservation.domain.response.ProviderReservationDto;
import com.anthonycorp.reservapp.Reservation.domain.status.ReservationStatus;
import com.anthonycorp.reservapp.Reservation.infrastructure.mapper.ReservationMapper;
import com.anthonycorp.reservapp.Reservation.infrastructure.model.ReservationEntity;
import com.anthonycorp.reservapp.Reservation.infrastructure.repository.ReservationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GetProviderReservationsUseCaseImpl implements GetProviderReservationsUseCase {

    private final ReservationRepository reservationRepository;
    private final ReservationMapper reservationMapper;

    @Override
    public List<ProviderReservationDto> execute(String providerEmail, ReservationStatus status) {

        List<ReservationEntity> reservations;

    if (status != null) {
            reservations = reservationRepository.findByProviderEmailAndStatus(providerEmail, status);
        } else {
            reservations = reservationRepository.findByProviderEmail(providerEmail);
        }

        return reservations.stream()
                .map(reservationMapper::toProviderReservationDto).toList();
    }
}
