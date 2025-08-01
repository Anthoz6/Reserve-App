package com.anthonycorp.reservapp.Service.application.GetAllServices;

import com.anthonycorp.reservapp.Service.domain.response.ServiceResponseDto;
import com.anthonycorp.reservapp.Service.infrastructure.mapper.ServiceMapper;
import com.anthonycorp.reservapp.Service.infrastructure.repository.ServiceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GetAllServicesUseCaseImpl implements GetAllServicesUseCase {

    private final ServiceRepository serviceRepository;
    private final ServiceMapper serviceMapper;


    @Override
    public List<ServiceResponseDto> execute() {
        List<ServiceResponseDto> serviceResponseDto = serviceRepository.findAll()
                .stream()
                .map(serviceMapper::toDto)
                .collect(Collectors.toList());

        return serviceResponseDto;
    }
}
