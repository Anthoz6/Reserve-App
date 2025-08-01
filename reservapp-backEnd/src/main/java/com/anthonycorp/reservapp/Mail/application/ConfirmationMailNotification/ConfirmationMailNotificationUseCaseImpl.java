package com.anthonycorp.reservapp.Mail.application.ConfirmationMailNotification;

import com.anthonycorp.reservapp.Mail.domain.Request.ReservationConfirmationDto;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ConfirmationMailNotificationUseCaseImpl implements ConfirmationMailNotificationUseCase {

    private final JavaMailSender mailSender;

    @Async("taskExecutor")
    @Override
    public void sendReservationConfirmation(ReservationConfirmationDto confirmationDto) {
        String messageBody = """
                Hello %s,
        
                Your reservation has been send.
        
                📅 Date: %s
                🕒 Time: %s
                🏷️ Service: %s
                🔢 Reservation number: %s
        
                Thank you for choosing ReservApp!
                """.formatted(
                confirmationDto.getCustomerEmail(),
                confirmationDto.getDate(),
                confirmationDto.getTime(),
                confirmationDto.getServiceName(),
                confirmationDto.getReservationId()
        );

        var message = new SimpleMailMessage();
        message.setTo(confirmationDto.getCustomerEmail());
        message.setSubject("Your reservation confirmation");
        message.setText(messageBody);
        mailSender.send(message);

        System.out.println("Email sent with personalized body on thread: " + Thread.currentThread());
    }
}
