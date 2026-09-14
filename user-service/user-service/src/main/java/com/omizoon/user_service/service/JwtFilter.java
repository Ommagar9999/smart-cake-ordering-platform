package com.omizoon.user_service.service;

import com.omizoon.user_service.entity.UserEntity;
import com.omizoon.user_service.repository.UserRepository;
import com.omizoon.user_service.security.JwtService;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import lombok.RequiredArgsConstructor;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;

import org.springframework.stereotype.Component;

import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {


    private final JwtService jwtService;

    private final UserRepository userRepository;


    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {


        String authHeader =
                request.getHeader("Authorization");


        System.out.println(
                "AUTH HEADER = " + authHeader
        );


        // ==========================================
        // NO TOKEN
        // ==========================================

        if (authHeader == null ||
                !authHeader.startsWith("Bearer ")) {

            filterChain.doFilter(
                    request,
                    response
            );

            return;
        }


        // ==========================================
        // EXTRACT TOKEN
        // ==========================================

        String token =
                authHeader.substring(7);


        try {

            String email =
                    jwtService.extractEmail(token);


            System.out.println(
                    "EMAIL = " + email
            );


            UserEntity user =
                    userRepository
                            .findByEmail(email)
                            .orElse(null);


            System.out.println(
                    "USER = " + user
            );


            // ======================================
            // VALID TOKEN
            // ======================================

            if (user != null
                    && jwtService.isTokenValid(
                    token,
                    user
            )
                    && SecurityContextHolder
                    .getContext()
                    .getAuthentication() == null) {


                SimpleGrantedAuthority authority =
                        new SimpleGrantedAuthority(
                                "ROLE_" +
                                        user.getRole().name()
                        );


                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                user,
                                null,
                                List.of(authority)
                        );


                SecurityContextHolder
                        .getContext()
                        .setAuthentication(
                                authentication
                        );


                System.out.println(
                        "AUTHENTICATION SET"
                );
            }


        } catch (Exception e) {

            System.out.println(
                    "JWT ERROR = " +
                            e.getMessage()
            );
        }


        filterChain.doFilter(
                request,
                response
        );
    }
}