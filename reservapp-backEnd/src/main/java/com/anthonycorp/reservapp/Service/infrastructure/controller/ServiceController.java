package com.anthonycorp.reservapp.Service.infrastructure.controller;

import com.anthonycorp.reservapp.Service.application.CreateService.CreateServiceUseCase;
import com.anthonycorp.reservapp.Service.application.GetAllServices.GetAllServicesUseCase;
import com.anthonycorp.reservapp.Service.application.GetServicesByProvider.GetServicesByProviderUseCase;
import com.anthonycorp.reservapp.Service.application.UpdateService.UpdateServiceUseCase;
import com.anthonycorp.reservapp.Service.application.DeleteService.DeleteServiceUseCase;
import com.anthonycorp.reservapp.Service.domain.request.CreateServiceDto;
import com.anthonycorp.reservapp.Service.domain.request.UpdateServiceDto;
import com.anthonycorp.reservapp.Service.domain.response.ServiceResponseDto;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/services")
public class ServiceController {

    private final CreateServiceUseCase createServiceUseCase;
    private final DeleteServiceUseCase deleteServiceUseCase;
    private final UpdateServiceUseCase updateServiceUseCase;
    private final GetServicesByProviderUseCase getServicesByProviderUseCase;
    private final GetAllServicesUseCase getAllServicesUseCase;

    @PostMapping
    public ResponseEntity<ServiceResponseDto> createService(@RequestBody @Valid CreateServiceDto createServiceDto,
                                                            Authentication authentication) {
        String email = authentication.getName();
        ServiceResponseDto responseDto = createServiceUseCase.execute(createServiceDto, email);
        return ResponseEntity.status(HttpStatus.CREATED).body(responseDto);
    }

    @PatchMapping("/{serviceId}")
    public ResponseEntity<ServiceResponseDto> updateService(@PathVariable Long serviceId,
                                                            @RequestBody @Valid UpdateServiceDto updateServiceDto,
                                                            Authentication authentication) {
        String providerEmail = authentication.getName();
        ServiceResponseDto service = updateServiceUseCase.execute(serviceId, providerEmail, updateServiceDto);
        return ResponseEntity.status(HttpStatus.OK).body(service);
    }

    @DeleteMapping("/{serviceId}")
    public ResponseEntity<Void> deleteService(@PathVariable Long serviceId,
                                              Authentication authentication) {
        String providerEmail = authentication.getName();
        deleteServiceUseCase.execute(serviceId, providerEmail);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/me")
    public ResponseEntity<List<ServiceResponseDto>> getByProvider(Authentication authentication) {
        String providerEmail = authentication.getName();
        List<ServiceResponseDto> services = getServicesByProviderUseCase.execute(providerEmail);
        return ResponseEntity.status(HttpStatus.OK).body(services);
    }

    @GetMapping()
    public ResponseEntity<List<ServiceResponseDto>> getAllServices() {
        List<ServiceResponseDto> services = getAllServicesUseCase.execute();
        return ResponseEntity.ok(services);
    }

}
