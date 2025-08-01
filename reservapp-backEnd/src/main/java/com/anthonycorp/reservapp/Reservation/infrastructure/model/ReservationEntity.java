package com.anthonycorp.reservapp.Reservation.infrastructure.model;

import com.anthonycorp.reservapp.Reservation.domain.status.ReservationStatus;
import com.anthonycorp.reservapp.Service.infrastructure.model.ServiceEntity;
import com.anthonycorp.reservapp.User.infrastructure.model.UserEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Getter
@Setter
@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "reservations")
public class ReservationEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "customer_id", nullable = false)
    private UserEntity customer;

    @ManyToOne
    @JoinColumn(name = "provider_id", nullable = false)
    private UserEntity provider;

    @ManyToOne
    @JoinColumn(name = "service_id", nullable = false)
    private ServiceEntity service;

    private LocalDate date;

    private LocalTime time;

    private LocalDateTime createdAt;

    @Enumerated(EnumType.STRING)
    private ReservationStatus status;

}
