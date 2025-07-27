package com.anthonycorp.reservapp.User.application.DeleteUser;

import com.anthonycorp.reservapp.User.infrastructure.exception.UserNotFoundException;
import com.anthonycorp.reservapp.User.infrastructure.model.UserEntity;
import com.anthonycorp.reservapp.User.infrastructure.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DeleteUserUseCaseImpl implements  DeleteUserUseCase {

    private final UserRepository userRepository;

    @Override
    public void execute(Long userId) {
        UserEntity userEntity = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User with id " + userId + " not found"));

        userRepository.delete(userEntity);
    }
}
