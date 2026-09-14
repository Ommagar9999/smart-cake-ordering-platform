package com.omizoon.OrderService.service;

import com.omizoon.OrderService.security.JwtService;

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
            FilterChain filterChain
    ) throws ServletException, IOException {

        String authHeader =
                request.getHeader("Authorization");

        System.out.println(
                "ORDER AUTH HEADER = " + authHeader
        );

        // ==========================================
        // NO TOKEN
        // ==========================================

        if (authHeader == null ||
                !authHeader.startsWith("Bearer ")) {

            System.out.println(
                    "ORDER JWT = No Bearer token found"
            );

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

            // ======================================
            // VALIDATE JWT
            // ======================================

            if (jwtService.isTokenValid(token)) {

                // ==================================
                // EXTRACT EMAIL
                // ==================================

                String email =
                        jwtService.extractEmail(token);

                // ==================================
                // EXTRACT ROLE
                // ==================================

                String role =
                        jwtService.extractRole(token);

                System.out.println(
                        "ORDER USER = " + email
                );

                System.out.println(
                        "ORDER ROLE = " + role
                );

                // ==================================
                // AUTHORITY
                // ==================================

                SimpleGrantedAuthority authority =
                        new SimpleGrantedAuthority(
                                "ROLE_" + role
                        );

                // ==================================
                // AUTHENTICATION
                // ==================================

                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                email,
                                null,
                                List.of(authority)
                        );

                // ==================================
                // SET SECURITY CONTEXT
                // ==================================

                SecurityContextHolder
                        .getContext()
                        .setAuthentication(
                                authentication
                        );

                System.out.println(
                        "ORDER AUTHENTICATION SET"
                );

            } else {

                System.out.println(
                        "ORDER JWT = Token validation FAILED"
                );
            }

        } catch (Exception e) {

            // ======================================
            // JWT ERROR DETAILS
            // ======================================

            System.out.println(
                    "======================================"
            );

            System.out.println(
                    "ORDER JWT ERROR = "
                            + e.getMessage()
            );

            System.out.println(
                    "======================================"
            );

            e.printStackTrace();
        }

        // ==========================================
        // CONTINUE REQUEST
        // ==========================================

        filterChain.doFilter(
                request,
                response
        );
    }
}