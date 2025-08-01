package com.anthonycorp.reservapp.Service.application.DeleteService;

import com.anthonycorp.reservapp.Service.infrastructure.exception.ServiceNotFoundException;
import com.anthonycorp.reservapp.Service.infrastructure.repository.ServiceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.concurrent.CompletableFuture;

@Service
@RequiredArgsConstructor
public class DeleteServiceUseCaseImpl implements DeleteServiceUseCase {

    private final ServiceRepository serviceRepository;

    @Override
    public void execute(Long serviceId, String providerEmail) {
        var service = serviceRepository.findById(serviceId)
                .orElseThrow(() -> new ServiceNotFoundException("Service with ID " + serviceId + " not found"));

        if(!service.getProvider().getEmail().equals(providerEmail)) {
            throw new IllegalArgumentException("You are not authorized to delete this service");
        }

        serviceRepository.delete(service);

    }
}
