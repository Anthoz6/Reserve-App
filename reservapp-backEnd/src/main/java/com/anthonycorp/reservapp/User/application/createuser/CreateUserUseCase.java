package com.anthonycorp.reservapp.User.application.createuser;

import com.anthonycorp.reservapp.User.domain.request.CreateUserDto;
import com.anthonycorp.reservapp.User.domain.response.UserResponseDto;

public interface CreateUserUseCase {
    UserResponseDto execute(CreateUserDto createUserDto);
}
