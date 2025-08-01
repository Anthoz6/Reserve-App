package com.anthonycorp.reservapp.Reservation.infrastructure.mapper;

import com.anthonycorp.reservapp.Reservation.domain.response.ProviderReservationDto;
import com.anthonycorp.reservapp.Reservation.domain.response.ReservationResponseDto;
import com.anthonycorp.reservapp.Reservation.infrastructure.model.ReservationEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel  = "spring")
public interface ReservationMapper {
    @Mapping(source = "service.title", target = "serviceTitle")
    @Mapping(source = "provider.name", target = "providerName")
    @Mapping(source = "customer.name", target = "customerName")
    ReservationResponseDto toDto(ReservationEntity reservation);

    @Mapping(source = "customer.name", target = "customerName")
    @Mapping(source = "customer.email", target = "customerEmail")
    @Mapping(source = "service.title", target = "serviceName")
    @Mapping(target = "reservationDateTime", expression = "java(java.time.LocalDateTime.of(reservationEntity.getDate(), reservationEntity.getTime()))")
    ProviderReservationDto toProviderReservationDto(ReservationEntity reservationEntity);

}
