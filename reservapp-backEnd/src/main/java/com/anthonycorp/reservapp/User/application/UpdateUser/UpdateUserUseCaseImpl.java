package com.anthonycorp.reservapp.User.application.UpdateUser;

import com.anthonycorp.reservapp.User.domain.request.UpdateUserDto;
import com.anthonycorp.reservapp.User.domain.response.UserResponseDto;
import com.anthonycorp.reservapp.User.infrastructure.mapper.UserMapper;

import com.anthonycorp.reservapp.User.infrastructure.model.UserEntity;

import com.anthonycorp.reservapp.User.infrastructure.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UpdateUserUseCaseImpl implements UpdateUserUseCase {

    private final UserRepository userRepository;
    private final UserMapper userMapper;

    @Override
    public UserResponseDto execute(Long userId, UpdateUserDto updateUserDto) {
        UserEntity userEntity = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("UserEntity with id "+ userId + " not found"));

        Optional.ofNullable(updateUserDto.getName()).ifPresent(userEntity::setName);
        Optional.ofNullable(updateUserDto.getEmail()).ifPresent(userEntity::setEmail);
        return userMapper.toDto(userRepository.save(userEntity));
    }
}
