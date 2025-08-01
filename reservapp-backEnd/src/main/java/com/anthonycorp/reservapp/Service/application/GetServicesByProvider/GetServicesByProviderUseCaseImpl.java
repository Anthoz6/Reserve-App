package com.anthonycorp.reservapp.Service.application.GetServicesByProvider;

import com.anthonycorp.reservapp.Service.domain.response.ServiceResponseDto;
import com.anthonycorp.reservapp.Service.infrastructure.mapper.ServiceMapper;
import com.anthonycorp.reservapp.Service.infrastructure.repository.ServiceRepository;
import com.anthonycorp.reservapp.User.domain.Role.RoleEnum;
import com.anthonycorp.reservapp.User.infrastructure.exception.UserNotFoundException;
import com.anthonycorp.reservapp.User.infrastructure.model.UserEntity;
import com.anthonycorp.reservapp.User.infrastructure.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GetServicesByProviderUseCaseImpl implements GetServicesByProviderUseCase {

    private final ServiceRepository serviceRepository;
    private final ServiceMapper serviceMapper;
    private final UserRepository userRepository;

    @Override
    public List<ServiceResponseDto> execute(String email) {
        UserEntity provider = userRepository.findUserByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("Authenticated user not found"));

        if (!provider.getRoleEntity().getRole().equals(RoleEnum.PROVIDER)) {
            throw new IllegalArgumentException("The user with ID " + provider + " is not a PROVIDER");
        }

        return serviceRepository.findAllByProviderId(provider.getId()).stream()
                .map(serviceMapper::toDto)
                .toList();
    }
}
