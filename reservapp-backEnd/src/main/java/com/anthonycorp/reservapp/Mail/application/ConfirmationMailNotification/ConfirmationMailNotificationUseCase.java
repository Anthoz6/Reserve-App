package com.anthonycorp.reservapp.Mail.application.ConfirmationMailNotification;

import com.anthonycorp.reservapp.Mail.domain.Request.ReservationConfirmationDto;

public interface ConfirmationMailNotificationUseCase {
    void sendReservationConfirmation(ReservationConfirmationDto confirmationDto);
}
