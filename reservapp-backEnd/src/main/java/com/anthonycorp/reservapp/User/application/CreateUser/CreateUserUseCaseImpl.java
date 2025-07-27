package com.anthonycorp.reservapp.User.application.CreateUser;

import com.anthonycorp.reservapp.User.domain.request.CreateUserDto;
import com.anthonycorp.reservapp.User.domain.response.UserResponseDto;
import com.anthonycorp.reservapp.User.infrastructure.exception.EmailAlreadyInUse;
import com.anthonycorp.reservapp.User.infrastructure.exception.RoleNotFound;
import com.anthonycorp.reservapp.User.infrastructure.mapper.UserMapper;

import com.anthonycorp.reservapp.User.infrastructure.model.RoleEntity;
import com.anthonycorp.reservapp.User.infrastructure.model.UserEntity;

import com.anthonycorp.reservapp.User.infrastructure.repository.RoleRepository;
import com.anthonycorp.reservapp.User.infrastructure.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CreateUserUseCaseImpl implements CreateUserUseCase {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public UserResponseDto execute(CreateUserDto createUserDto) {
        userRepository.findUserByEmail(createUserDto.getEmail())
                .ifPresent(user -> {throw new EmailAlreadyInUse("Email already in userEntity: " + user.getEmail());});
        UserEntity userEntity = userMapper.toEntity(createUserDto);
        RoleEntity roleEntity = roleRepository.findById(createUserDto.getRolId())
                .orElseThrow(() -> new RoleNotFound("Rol with id: "+ createUserDto.getRolId() + " Not found"));
        userEntity.setPassword(passwordEncoder.encode(createUserDto.getPassword()));
        userEntity.setRoleEntity(roleEntity);
        UserEntity savedUserEntity = userRepository.save(userEntity);
        return userMapper.toDto(savedUserEntity);
    }
}
