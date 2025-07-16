package com.anthonycorp.reservapp.User.infrastructure.mapper;

import com.anthonycorp.reservapp.User.domain.request.CreateUserDto;
import com.anthonycorp.reservapp.User.domain.response.UserResponseDto;
import com.anthonycorp.reservapp.User.domain.response.UserNameDto;

import com.anthonycorp.reservapp.User.infrastructure.model.UserEntity;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface UserMapper {
    UserResponseDto toDto(UserEntity userEntity);
    UserEntity toEntity(CreateUserDto createUserDto);
    @Mapping(target = "email", source = "email")
    @Mapping(target = "role", expression = "java(userEntity.getRoleEntity().getRole().name())")
    UserNameDto toNameDto(UserEntity userEntity);
    List<UserNameDto> toNameDtoList(List<UserEntity> userEntityList);
}
