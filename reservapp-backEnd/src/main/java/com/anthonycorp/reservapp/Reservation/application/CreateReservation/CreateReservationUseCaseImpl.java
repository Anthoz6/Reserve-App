package com.anthonycorp.reservapp.Reservation.application.CreateReservation;

import com.anthonycorp.reservapp.Mail.application.MailNotification.MailNotificationUseCase;
import com.anthonycorp.reservapp.Mail.domain.Request.ReservationConfirmationDto;
import com.anthonycorp.reservapp.Reservation.domain.request.CreateReservationDto;
import com.anthonycorp.reservapp.Reservation.domain.response.ReservationResponseDto;
import com.anthonycorp.reservapp.Reservation.domain.status.ReservationStatus;
import com.anthonycorp.reservapp.Reservation.infrastructure.mapper.ReservationMapper;
import com.anthonycorp.reservapp.Reservation.infrastructure.model.ReservationEntity;
import com.anthonycorp.reservapp.Reservation.infrastructure.repository.ReservationRepository;
import com.anthonycorp.reservapp.Service.infrastructure.exception.ServiceNotFoundException;
import com.anthonycorp.reservapp.Service.infrastructure.model.ServiceEntity;
import com.anthonycorp.reservapp.Service.infrastructure.repository.ServiceRepository;
import com.anthonycorp.reservapp.User.infrastructure.exception.UserNotFoundException;
import com.anthonycorp.reservapp.User.infrastructure.model.UserEntity;
import com.anthonycorp.reservapp.User.infrastructure.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class CreateReservationUseCaseImpl implements CreateReservationUseCase {

    private final UserRepository userRepository;
    private final ServiceRepository serviceRepository;
    private final ReservationRepository reservationRepository;
    private final ReservationMapper reservationMapper;
    private final MailNotificationUseCase mailNotificationUseCase;

    @Override
    public ReservationResponseDto execute(String email, CreateReservationDto dto) {

        UserEntity customer = userRepository.findUserByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("Customer not found"));

        ServiceEntity service = serviceRepository.findById(dto.getServiceId())
                .orElseThrow(() -> new ServiceNotFoundException("Service not found"));

        UserEntity provider = service.getProvider();

        ReservationEntity reservation = ReservationEntity.builder()
                .customer(customer)
                .provider(provider)
                .service(service)
                .date(dto.getDate())
                .time(dto.getTime())
                .status(ReservationStatus.PENDING)
                .build();

        // Send mail
        mailNotificationUseCase.sendReservationConfirmation(
                new ReservationConfirmationDto(
                        customer.getName(),
                        customer.getEmail(),
                        reservation.getId(),
                        reservation.getDate(),
                        reservation.getTime(),
                        service.getTitle()
                )
        );

        return reservationMapper.toDto(reservationRepository.save(reservation));
    }
}
