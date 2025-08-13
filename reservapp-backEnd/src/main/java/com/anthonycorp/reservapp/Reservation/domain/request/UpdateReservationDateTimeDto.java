package com.anthonycorp.reservapp.Reservation.domain.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UpdateReservationDateTimeDto {

    @NotNull(message = "The new date is mandatory")
    private LocalDate date;

    @NotNull(message = "The new time is mandatory")
    private LocalTime time;
}
