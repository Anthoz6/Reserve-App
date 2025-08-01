package com.anthonycorp.reservapp.Reservation.application.GetMyReservations;

import com.anthonycorp.reservapp.Reservation.domain.response.ReservationResponseDto;
import com.anthonycorp.reservapp.Reservation.infrastructure.repository.ReservationRepository;
import com.anthonycorp.reservapp.User.infrastructure.exception.UserNotFoundException;
import com.anthonycorp.reservapp.User.infrastructure.model.UserEntity;
import com.anthonycorp.reservapp.User.infrastructure.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GetMyReservationsUseCaseImpl implements GetMyReservationsUseCase {

    private final ReservationRepository reservationRepository;
    private final UserRepository userRepository;

    @Override
    public List<ReservationResponseDto> getReservationAsCustomer(String email) {
        UserEntity user = userRepository.findUserByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("Authenticated user not found"));
        return reservationRepository.findByCustomer(user)
                .stream()
                .map(reservation -> ReservationResponseDto.builder()
                        .id(reservation.getId())
                        .customerName(reservation.getCustomer().getName())
                        .providerName(reservation.getProvider().getName())
                        .serviceTitle(reservation.getService().getTitle())
                        .date(reservation.getDate().toString())
                        .time(reservation.getTime().toString())
                        .status(reservation.getStatus().toString())
                        .build())
                .collect(Collectors.toList());
    }
}
