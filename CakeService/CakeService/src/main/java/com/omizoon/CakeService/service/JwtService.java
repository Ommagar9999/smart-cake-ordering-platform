
        package com.omizoon.CakeService.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;

@Service
public class JwtService {

    @Value("${jwt.secret}")
    private String secret;

    // ==========================================
    // SIGNING KEY
    // ==========================================

    private SecretKey getSigningKey() {

        return Keys.hmacShaKeyFor(
                secret.getBytes(StandardCharsets.UTF_8)
        );
    }

    // ==========================================
    // EXTRACT EMAIL
    // ==========================================

    public String extractEmail(String token) {

        return extractAllClaims(token)
                .getSubject();
    }

    // ==========================================
    // EXTRACT ROLE
    // ==========================================

    public String extractRole(String token) {

        return extractAllClaims(token)
                .get("role", String.class);
    }

    // ==========================================
    // EXTRACT ALL CLAIMS
    // ==========================================

    private Claims extractAllClaims(String token) {

        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}

