package com.anthonycorp.reservapp.Reservation.domain.request;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CreateReservationDto {

    @NotNull(message = "The service ID is required")
    private Long serviceId;

    @NotNull(message = "The date is mandatory")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate date;

    @NotNull(message = "The time is mandatory")
    @JsonFormat(pattern = "HH:mm:ss")
    private LocalTime time;

    private LocalDateTime createdAt;
}
