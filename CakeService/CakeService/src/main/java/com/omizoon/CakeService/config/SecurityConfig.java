package com.omizoon.CakeService.config;

import com.omizoon.CakeService.service.JwtFilter;
import lombok.RequiredArgsConstructor;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.http.HttpMethod;

import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@RequiredArgsConstructor
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtFilter jwtFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http) throws Exception {

        http
                // ==============================
                // CSRF
                // ==============================
                .csrf(csrf -> csrf.disable())

                // ==============================
                // SESSION
                // ==============================
                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )

                // ==============================
                // AUTHORIZATION
                // ==============================
                .authorizeHttpRequests(auth -> auth

                        // PUBLIC GET
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/cakes",
                                "/api/cakes/**"
                        ).permitAll()

                        // ADMIN CREATE
                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/cakes"
                        ).hasRole("ADMIN")

                        // ADMIN UPDATE
                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/cakes/**"
                        ).hasRole("ADMIN")

                        // ADMIN DELETE
                        .requestMatchers(
                                HttpMethod.DELETE,
                                "/api/cakes/**"
                        ).hasRole("ADMIN")

                        // OTHER REQUESTS
                        .anyRequest().authenticated()
                )

                // ==============================
                // JWT FILTER
                // ==============================
                .addFilterBefore(
                        jwtFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }
}