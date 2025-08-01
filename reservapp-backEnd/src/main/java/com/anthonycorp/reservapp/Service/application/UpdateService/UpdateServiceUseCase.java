package com.anthonycorp.reservapp.Service.application.UpdateService;

import com.anthonycorp.reservapp.Service.domain.request.UpdateServiceDto;
import com.anthonycorp.reservapp.Service.domain.response.ServiceResponseDto;

import java.util.concurrent.CompletableFuture;

public interface UpdateServiceUseCase {
    ServiceResponseDto execute(Long serviceId, String providerEmail, UpdateServiceDto updateServiceDto);
}
