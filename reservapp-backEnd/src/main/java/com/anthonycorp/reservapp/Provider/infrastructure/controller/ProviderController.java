package com.anthonycorp.reservapp.Provider.infrastructure.controller;

import com.anthonycorp.reservapp.Reservation.application.GetProviderReservations.GetProviderReservationsUseCase;
import com.anthonycorp.reservapp.Reservation.application.UpdateReservationStatus.UpdateReservationStatusUseCase;
import com.anthonycorp.reservapp.Service.application.UpdateServiceStatus.UpdateServiceStatusUseCase; // Corregido
import com.anthonycorp.reservapp.Reservation.domain.response.ProviderReservationDto;
import com.anthonycorp.reservapp.Reservation.domain.status.ReservationStatus;
import com.anthonycorp.reservapp.Service.domain.status.ServiceStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/provider")
@RequiredArgsConstructor
public class ProviderController {

    private final GetProviderReservationsUseCase getProviderReservationsUseCase;
    private final UpdateReservationStatusUseCase updateReservationStatusUseCase;
    private final UpdateServiceStatusUseCase updateServiceStatusUseCase;

    @GetMapping("/reservations")
    public ResponseEntity<List<ProviderReservationDto>> getReservations(
            @RequestParam(required = false) ReservationStatus status,
            Authentication authentication) {
        String providerEmail = authentication.getName();
        return ResponseEntity.ok(getProviderReservationsUseCase.execute(providerEmail, status));
    }

    @PutMapping("/reservations/{reservationId}/status")
    public ResponseEntity<Void> updateReservationStatus(
            @PathVariable Long reservationId,
            @RequestParam ReservationStatus status,
            Authentication authentication) {
        String providerEmail = authentication.getName();
        updateReservationStatusUseCase.execute(reservationId, status, providerEmail);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/services/{serviceId}/status")
    public ResponseEntity<Void> updateServiceStatus(
            @PathVariable Long serviceId,
            @RequestParam ServiceStatus status,
            Authentication authentication) {
        String providerEmail = authentication.getName();
        updateServiceStatusUseCase.execute(serviceId, status, providerEmail);
        return ResponseEntity.ok().build();
    }
}