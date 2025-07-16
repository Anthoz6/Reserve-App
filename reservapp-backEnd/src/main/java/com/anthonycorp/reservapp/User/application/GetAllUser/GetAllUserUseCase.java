package com.anthonycorp.reservapp.User.application.GetAllUser;

import com.anthonycorp.reservapp.User.domain.response.UserNameDto;
import java.util.List;

public interface GetAllUserUseCase {
    List<UserNameDto> execute();
} 