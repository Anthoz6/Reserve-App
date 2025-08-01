package com.anthonycorp.reservapp.Mail.application.ReservationMailNotification;

import com.anthonycorp.reservapp.Mail.domain.Request.ReservationNotificationRequestDto;

public interface ReservationMailNotificationUseCase {

    void sendReservationConfirmationToProvider(ReservationNotificationRequestDto request);

    void sendReservationStatusUpdateToCustomer(ReservationNotificationRequestDto request);

    String createProviderNotificationContent(ReservationNotificationRequestDto request);

    String createCustomerNotificationContent(ReservationNotificationRequestDto request);
}
