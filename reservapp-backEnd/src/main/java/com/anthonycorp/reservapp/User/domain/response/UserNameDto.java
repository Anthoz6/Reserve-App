package com.anthonycorp.reservapp.User.domain.response;

import com.anthonycorp.reservapp.User.infrastructure.model.RoleEntity;
import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserNameDto {
    private Long id;
    private String name;
    private String email;
    private String role;
}
