package com.anthonycorp.reservapp.Service.application.DeleteService;

import java.util.concurrent.CompletableFuture;

public interface DeleteServiceUseCase {
    void execute(Long serviceId, String providerEmail);
}
