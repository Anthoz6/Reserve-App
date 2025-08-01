package com.anthonycorp.reservapp.Service.application.CreateService;

import com.anthonycorp.reservapp.Service.domain.request.CreateServiceDto;
import com.anthonycorp.reservapp.Service.domain.response.ServiceResponseDto;
import com.anthonycorp.reservapp.Service.domain.status.ServiceStatus;
import com.anthonycorp.reservapp.Service.infrastructure.mapper.ServiceMapper;
import com.anthonycorp.reservapp.Service.infrastructure.model.ServiceEntity;
import com.anthonycorp.reservapp.Service.infrastructure.repository.ServiceRepository;
import com.anthonycorp.reservapp.User.domain.Role.RoleEnum;
import com.anthonycorp.reservapp.User.infrastructure.exception.UserNotFoundException;
import com.anthonycorp.reservapp.User.infrastructure.model.UserEntity;
import com.anthonycorp.reservapp.User.infrastructure.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.Builder;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.concurrent.CompletableFuture;

@Service
@Builder
@RequiredArgsConstructor
public class CreateServiceUseCaseImpl implements CreateServiceUseCase {

    private final ServiceRepository serviceRepository;
    private final UserRepository userRepository;
    private final ServiceMapper serviceMapper;

    @Override
    public ServiceResponseDto execute(CreateServiceDto createServiceDto, String providerEmail) {
        UserEntity provider = userRepository.findUserByEmail(providerEmail)
                .orElseThrow(() -> new UserNotFoundException("Provider not found"));

        ServiceEntity serviceEntity = ServiceEntity.builder()
                .title(createServiceDto.getTitle())
                .description(createServiceDto.getDescription())
                .price(createServiceDto.getPrice())
                .provider(provider)
                .status(ServiceStatus.ACTIVE) // Default to ACTIVE if not provided
                .build();

        return serviceMapper.toDto(serviceRepository.save(serviceEntity));
    }
}
