package com.anthonycorp.reservapp.Mail.application.ReservationMailNotification;

import com.anthonycorp.reservapp.Mail.domain.Request.ReservationNotificationRequestDto;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;

@Service
@RequiredArgsConstructor
public class ReservationMailNotificationUseCaseImpl implements ReservationMailNotificationUseCase {

    private final JavaMailSender mailSender;

    @Async("taskExecutor")
    @Override
    public void sendReservationConfirmationToProvider(ReservationNotificationRequestDto request) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(request.getRecipientEmail());
        message.setSubject("New Reservation to " + request.getProviderName());
        message.setText(createProviderNotificationContent(request));
        mailSender.send(message);
        System.out.println("Email sent createProviderNotificationContent : " + Thread.currentThread());
    }

    @Async("taskExecutor")
    @Override
    public void sendReservationStatusUpdateToCustomer(ReservationNotificationRequestDto request) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(request.getRecipientEmail());
        message.setSubject("Update of your Reservation - " + request.getServiceName());
        message.setText(createCustomerNotificationContent(request));
        mailSender.send(message);
        System.out.println("Email sent createCustomerNotificationContent : " + Thread.currentThread());

    }

    @Override
    public String createProviderNotificationContent(ReservationNotificationRequestDto request) {
        return String.format("""
            Hola %s,
            
            Has recibido una nueva solicitud de reserva:
            
            Cliente: %s
            Servicio: %s
            Fecha y Hora: 
            
            Por favor, ingresa a tu panel para confirmar o rechazar la reserva.
            
            Saludos,
            ReservApp Team
            """,
                request.getProviderName(),
                request.getCustomerName(),
                request.getServiceName()
                //request.getReservationDateTime().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm"))
        );
    }

    @Override
    public String createCustomerNotificationContent(ReservationNotificationRequestDto request) {
        String statusMessage = switch (request.getStatus()) {
            case ACCEPTED -> "Tu reserva ha sido confirmada.";
            case CANCELLED -> "Tu reserva ha sido cancelada.";
            case PENDING -> "Tu reserva está pendiente de confirmación.";
            default -> "ha cambiado de estado";
        };
        return String.format("""
            Hola %s,
            
            Tu reserva para %s %s.
            
            Detalles de la reserva:
            Servicio: %s
            Proveedor: %s
            Fecha y Hora: 
            Estado: %s
            
            Saludos,
            ReservApp Team
            """,
                request.getCustomerName(),
                request.getServiceName(),
                statusMessage,
                request.getServiceName(),
                request.getProviderName(),
                // request.getReservationDateTime().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm")),
                request.getStatus()
        );
    }
}
