package com.anthonycorp.reservapp.Service.application.UpdateService;

import com.anthonycorp.reservapp.Service.domain.request.UpdateServiceDto;
import com.anthonycorp.reservapp.Service.domain.response.ServiceResponseDto;
import com.anthonycorp.reservapp.Service.infrastructure.exception.ServiceNotFoundException;
import com.anthonycorp.reservapp.Service.infrastructure.mapper.ServiceMapper;
import com.anthonycorp.reservapp.Service.infrastructure.model.ServiceEntity;
import com.anthonycorp.reservapp.Service.infrastructure.repository.ServiceRepository;
import com.anthonycorp.reservapp.User.infrastructure.exception.UserNotFoundException;
import com.anthonycorp.reservapp.User.infrastructure.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.concurrent.CompletableFuture;

@Service
@RequiredArgsConstructor
public class UpdateServiceUseCaseImpl implements UpdateServiceUseCase {

    private final ServiceRepository serviceRepository;
    private final ServiceMapper serviceMapper;
    private final UserRepository userRepository;

    @Override
    public ServiceResponseDto execute(Long serviceId, String providerEmail, UpdateServiceDto updateServiceDto) {

        var provider = userRepository.findUserByEmail(providerEmail)
                .orElseThrow(() -> new UserNotFoundException("Provider not found"));

        ServiceEntity service = serviceRepository.findById(serviceId)
                .orElseThrow(() -> new ServiceNotFoundException("Service with ID " + serviceId + " not found"));

        if (!service.getProvider().getId().equals(provider.getId())) {
            throw new IllegalArgumentException("You are not authorized to update this service");
        }

        Optional.ofNullable(updateServiceDto.getTitle()).ifPresent(service::setTitle);
        Optional.ofNullable(updateServiceDto.getDescription()).ifPresent(service::setDescription);
        Optional.ofNullable(updateServiceDto.getPrice()).ifPresent(service::setPrice);

        return serviceMapper.toDto(serviceRepository.save(service));
    }
}