package com.anthonycorp.reservapp.User.application.GetAllUser;


import com.anthonycorp.reservapp.User.domain.response.UserNameDto;
import com.anthonycorp.reservapp.User.infrastructure.mapper.UserMapper;
import com.anthonycorp.reservapp.User.infrastructure.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class GetAllUserUseCaseImpl implements GetAllUserUseCase {

    private final UserRepository userRepository;
    private final UserMapper userMapper;

    @Override
    public List<UserNameDto> execute() {
        return userMapper.toNameDtoList(userRepository.findAll());
    }
} 