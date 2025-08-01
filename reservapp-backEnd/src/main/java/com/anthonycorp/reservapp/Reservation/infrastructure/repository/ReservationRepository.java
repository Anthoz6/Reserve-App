package com.anthonycorp.reservapp.Reservation.infrastructure.repository;

import com.anthonycorp.reservapp.Reservation.domain.status.ReservationStatus;
import com.anthonycorp.reservapp.Reservation.infrastructure.model.ReservationEntity;
import com.anthonycorp.reservapp.User.infrastructure.model.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ReservationRepository extends JpaRepository<ReservationEntity, Long> {
    List<ReservationEntity> findByCustomer(UserEntity customer);

    List<ReservationEntity> findByProviderEmailAndStatus(String providerEmail, ReservationStatus status);

    List<ReservationEntity> findByProviderEmail(String providerEmail);

    Optional <ReservationEntity> findByIdAndCustomerEmail(Long id, String customerEmail);
}
