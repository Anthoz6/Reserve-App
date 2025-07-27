package com.anthonycorp.reservapp.User.application.UpdateUser;

import com.anthonycorp.reservapp.User.domain.request.UpdateUserDto;
import com.anthonycorp.reservapp.User.domain.response.UserResponseDto;

public interface UpdateUserUseCase {
    UserResponseDto execute(Long userId, UpdateUserDto updateUserDto);
}
