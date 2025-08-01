package com.anthonycorp.reservapp.Service.application.UpdateServiceStatus;

import com.anthonycorp.reservapp.Service.domain.status.ServiceStatus;

public interface UpdateServiceStatusUseCase {

    void execute(Long serviceId, ServiceStatus newStatus, String providerEmail);
}
