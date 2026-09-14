
        package com.omizoon.CakeService.service;

import io.jsonwebtoken.JwtException;

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

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        String authHeader =
                request.getHeader("Authorization");

        System.out.println(
                "CAKE AUTH HEADER = " + authHeader
        );

        // ==========================================
        // NO TOKEN
        // ==========================================

        if (authHeader == null ||
                !authHeader.startsWith("Bearer ")) {

            filterChain.doFilter(request, response);
            return;
        }

        // ==========================================
        // EXTRACT TOKEN
        // ==========================================

        String token =
                authHeader.substring(7);

        try {

            // ==========================================
            // EXTRACT USER DETAILS
            // ==========================================

            String email =
                    jwtService.extractEmail(token);

            String role =
                    jwtService.extractRole(token);

            System.out.println(
                    "CAKE USER = " + email
            );

            System.out.println(
                    "CAKE ROLE = " + role
            );

            // ==========================================
            // CREATE AUTHORITY
            // ==========================================

            SimpleGrantedAuthority authority =
                    new SimpleGrantedAuthority(
                            "ROLE_" + role
                    );

            // ==========================================
            // CREATE AUTHENTICATION
            // ==========================================

            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(
                            email,
                            null,
                            List.of(authority)
                    );

            // ==========================================
            // SET SECURITY CONTEXT
            // ==========================================

            SecurityContextHolder
                    .getContext()
                    .setAuthentication(
                            authentication
                    );

            System.out.println(
                    "CAKE AUTHENTICATION SET"
            );

        } catch (JwtException |
                 IllegalArgumentException e) {

            System.out.println(
                    "CAKE JWT ERROR = "
                            + e.getClass().getSimpleName()
            );

            System.out.println(
                    "CAKE JWT MESSAGE = "
                            + e.getMessage()
            );

            SecurityContextHolder.clearContext();
        }

        filterChain.doFilter(
                request,
                response
        );
    }
}

