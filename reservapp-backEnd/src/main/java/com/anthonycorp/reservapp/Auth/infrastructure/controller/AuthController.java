package com.anthonycorp.reservapp.Auth.infrastructure.controller;

import com.anthonycorp.reservapp.Auth.application.Login.LoginUseCase;
import com.anthonycorp.reservapp.Auth.domain.Dto.request.LoginDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final LoginUseCase loginUseCase;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDto loginDto) {
        return new ResponseEntity<>(loginUseCase.execute(loginDto), HttpStatus.OK);
    }
}
