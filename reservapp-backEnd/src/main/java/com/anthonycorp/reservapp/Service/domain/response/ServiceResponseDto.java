package com.anthonycorp.reservapp.Service.domain.response;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ServiceResponseDto {
    private Long id;
    private String title;
    private String description;
    private Double price;
    private String providerName;
    private Long providerId;
    private String status;
}
