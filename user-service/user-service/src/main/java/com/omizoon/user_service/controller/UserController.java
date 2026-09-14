package com.omizoon.user_service.controller;

import com.omizoon.user_service.dto.UserResponse;
import com.omizoon.user_service.entity.UserEntity;
import com.omizoon.user_service.repository.UserRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;

    @GetMapping("/test")
    public String test() {
        return "JWT Authentication is working!";
    }

    @GetMapping("/by-email")
    public ResponseEntity<UserResponse> getUserByEmail(
            @RequestParam String email) {

        UserEntity user =
                userRepository.findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found with email: " + email
                                )
                        );

        UserResponse response =
                UserResponse.builder()
                        .id(user.getId())
                        .firstName(user.getFirstname())
                        .lastName(user.getLastName())
                        .email(user.getEmail())
                        .phoneNumber(user.getPhoneNumber())
                        .role(user.getRole().name())
                        .build();

        return ResponseEntity.ok(response);
    }
}