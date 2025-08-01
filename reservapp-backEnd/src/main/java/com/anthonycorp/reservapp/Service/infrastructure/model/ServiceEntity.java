package com.anthonycorp.reservapp.Service.infrastructure.model;

import com.anthonycorp.reservapp.Service.domain.status.ServiceStatus;
import com.anthonycorp.reservapp.User.infrastructure.model.UserEntity;
import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Builder
@Table(name = "services")
public class ServiceEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    private String description;

    private Double price;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "provider_id")
    private UserEntity provider;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ServiceStatus status = ServiceStatus.ACTIVE; // Default status is ACTIVE

}
