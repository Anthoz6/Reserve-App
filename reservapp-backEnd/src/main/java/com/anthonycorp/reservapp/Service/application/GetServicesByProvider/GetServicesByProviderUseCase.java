package com.anthonycorp.reservapp.Service.application.GetServicesByProvider;

import com.anthonycorp.reservapp.Service.domain.response.ServiceResponseDto;

import java.util.List;
import java.util.concurrent.CompletableFuture;

public interface GetServicesByProviderUseCase {
    List<ServiceResponseDto> execute(String email);
}
