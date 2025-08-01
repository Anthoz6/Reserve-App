package com.anthonycorp.reservapp.Service.application.UpdateServiceStatus;

import com.anthonycorp.reservapp.Service.domain.status.ServiceStatus;
import com.anthonycorp.reservapp.Service.infrastructure.exception.ServiceNotFoundException;
import com.anthonycorp.reservapp.Service.infrastructure.model.ServiceEntity;
import com.anthonycorp.reservapp.Service.infrastructure.repository.ServiceRepository;
import com.anthonycorp.reservapp.User.infrastructure.exception.UserNotFoundException;
import com.anthonycorp.reservapp.User.infrastructure.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UpdateServiceStatusUseCaseImpl implements UpdateServiceStatusUseCase {

    private final ServiceRepository serviceRepository;
    private final UserRepository userRepository;


    @Override
    public void execute(Long serviceId, ServiceStatus newStatus, String providerEmail) {
        var provider = userRepository.findUserByEmail(providerEmail)
                .orElseThrow(() -> new UserNotFoundException("Provider not found"));

        ServiceEntity service = serviceRepository.findById(serviceId)
                .orElseThrow(() -> new ServiceNotFoundException("Service with ID " + serviceId + " not found"));

        if (!service.getProvider().getId().equals(provider.getId())) {
            throw new IllegalArgumentException("You are not authorized to update this service status");
        }

        service.setStatus(newStatus);
        serviceRepository.save(service);
    }
}
