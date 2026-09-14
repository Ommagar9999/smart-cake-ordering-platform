package com.omizoon.user_service.service;



import com.omizoon.user_service.dto.AuthResponse;
import com.omizoon.user_service.dto.LoginRequest;
import com.omizoon.user_service.dto.RegisterRequest;

public interface UserService {

    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);

}