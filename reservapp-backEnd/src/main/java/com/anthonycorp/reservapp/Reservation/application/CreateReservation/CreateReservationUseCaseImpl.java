package com.anthonycorp.reservapp.Reservation.application.CreateReservation;

import com.anthonycorp.reservapp.Mail.application.ConfirmationMailNotification.ConfirmationMailNotificationUseCase;
import com.anthonycorp.reservapp.Mail.application.ReservationMailNotification.ReservationMailNotificationUseCase;
import com.anthonycorp.reservapp.Mail.domain.Request.ReservationConfirmationDto;
import com.anthonycorp.reservapp.Mail.domain.Request.ReservationNotificationRequestDto;
import com.anthonycorp.reservapp.Reservation.domain.request.CreateReservationDto;
import com.anthonycorp.reservapp.Reservation.domain.response.ReservationResponseDto;
import com.anthonycorp.reservapp.Reservation.domain.status.ReservationStatus;
import com.anthonycorp.reservapp.Reservation.infrastructure.mapper.ReservationMapper;
import com.anthonycorp.reservapp.Reservation.infrastructure.model.ReservationEntity;
import com.anthonycorp.reservapp.Reservation.infrastructure.repository.ReservationRepository;
import com.anthonycorp.reservapp.Service.domain.status.ServiceStatus;
import com.anthonycorp.reservapp.Service.infrastructure.exception.ServiceNotFoundException;
import com.anthonycorp.reservapp.Service.infrastructure.model.ServiceEntity;
import com.anthonycorp.reservapp.Service.infrastructure.repository.ServiceRepository;
import com.anthonycorp.reservapp.User.infrastructure.exception.UserNotFoundException;
import com.anthonycorp.reservapp.User.infrastructure.model.UserEntity;
import com.anthonycorp.reservapp.User.infrastructure.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;


@Service
@RequiredArgsConstructor
public class CreateReservationUseCaseImpl implements CreateReservationUseCase {

    private final UserRepository userRepository;
    private final ServiceRepository serviceRepository;
    private final ReservationRepository reservationRepository;
    private final ReservationMapper reservationMapper;
    private final ConfirmationMailNotificationUseCase confirmationMailNotificationUseCase;
    private final ReservationMailNotificationUseCase reservationMailNotificationUseCase;

    @Override
    public ReservationResponseDto execute(String email, CreateReservationDto dto) {

        validateReservationDateAndTime(dto.getDate(), dto.getTime());

        UserEntity customer = userRepository.findUserByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("Customer not found"));

        ServiceEntity service = serviceRepository.findById(dto.getServiceId())
                .orElseThrow(() -> new ServiceNotFoundException("Service not found"));

        if (!service.getStatus().equals(ServiceStatus.ACTIVE)) {
            throw new IllegalStateException("The service is not active. Unable to create a reservation.");
        }

        // Get provider details
        UserEntity provider = service.getProvider();

        // Create the reservation entity
        ReservationEntity reservation = ReservationEntity.builder()
                .customer(customer)
                .provider(provider)
                .service(service)
                .date(dto.getDate())
                .time(dto.getTime())
                .createdAt(dto.getCreatedAt())
                .status(ReservationStatus.PENDING)
                .build();

        // Save the reservation
        reservation = reservationRepository.save(reservation);

        // Send confirmation email
        confirmationMailNotificationUseCase.sendReservationConfirmation(
                new ReservationConfirmationDto(
                        customer.getName(),
                        customer.getEmail(),
                        reservation.getId(),
                        reservation.getDate(),
                        reservation.getTime(),
                        service.getTitle()
                )
        );

        // Send notification to the provider
        reservationMailNotificationUseCase.sendReservationConfirmationToProvider(
                ReservationNotificationRequestDto.builder()
                        .recipientEmail(provider.getEmail())
                        .customerName(customer.getName())
                        .providerName(provider.getName())
                        .serviceName(service.getTitle())
                        .status(ReservationStatus.PENDING)
                        .build()
        );

        return reservationMapper.toDto(reservation);
    }

    private void validateReservationDateAndTime(LocalDate date, LocalTime time) {
        LocalDate today = LocalDate.now();
        LocalTime currentTime = LocalTime.now();

        // Case 2: Ensure the date is not in the past
        if (date.isBefore(today)) {
            throw new IllegalArgumentException("Reservation date cannot be in the past.");
        }

        // Case 1: Ensure reservations for the same day are at least 3 hours in advance
        if (date.equals(today) && time.isBefore(currentTime.plusHours(3))) {
            throw new IllegalArgumentException("Reservations for the same day must be at least 3 hours in advance.");
        }
    }
}