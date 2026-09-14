package com.omizoon.user_service.service;


import com.omizoon.user_service.Enum.Role;
import com.omizoon.user_service.dto.AuthResponse;
import com.omizoon.user_service.dto.LoginRequest;
import com.omizoon.user_service.dto.RegisterRequest;
import com.omizoon.user_service.entity.UserEntity;
import com.omizoon.user_service.exception.EmailAlreadyExistsException;
import com.omizoon.user_service.exception.PhoneNumberAlreadyExistsException;
import com.omizoon.user_service.repository.UserRepository;
import com.omizoon.user_service.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private  final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Override
    public AuthResponse register(RegisterRequest request) {

         if ( userRepository.existsByEmail(request.getEmail()))
         {
             throw  new EmailAlreadyExistsException("Email already exists");
         }

         if (userRepository.existsByPhoneNumber(request.getPhoneNumber()))
         {
             throw new PhoneNumberAlreadyExistsException("Phone number already exists");
         }

        UserEntity user = UserEntity.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.USER)
                .firstname(request.getFirstName())
                .lastName(request.getLastName())
                .phoneNumber(request.getPhoneNumber())
                .build();

          userRepository.save(user);
        String token = jwtService.generateToken(user);
        return AuthResponse.builder()
                .message("User registered successfully")
                .role(user.getRole())
                .token(token)

                .build();
    }

    @Override
    public AuthResponse login(LoginRequest request) {

       UserEntity user = userRepository.findByEmail(request.getEmail())
               .orElseThrow(()->new RuntimeException("Invalid email or password"));

       if (!passwordEncoder.matches(request.getPassword(),user.getPassword()))
       {
           throw  new RuntimeException("Invalid email or password");
       }


        String token = jwtService.generateToken(user);


        return AuthResponse.builder()
                .message("Login successful")
                .role(user.getRole())
                .token(token)
                .build();


    }





}
