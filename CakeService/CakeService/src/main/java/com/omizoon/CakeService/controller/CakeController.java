package com.omizoon.CakeService.controller;

import com.omizoon.CakeService.dto.CakeRequest;
import com.omizoon.CakeService.dto.CakeResponse;
import com.omizoon.CakeService.service.CakeService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cakes")
@RequiredArgsConstructor
public class CakeController {

    private final CakeService cakeService;


    // ==========================================
    // ADMIN - CREATE CAKE
    // ==========================================

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CakeResponse> createCake(
            @Valid @RequestBody CakeRequest request) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(cakeService.createCake(request));
    }


    // ==========================================
    // PUBLIC - GET ALL CAKES
    // ==========================================

    @GetMapping
    public ResponseEntity<List<CakeResponse>> getAllCakes() {

        return ResponseEntity.ok(
                cakeService.getAllCakes()
        );
    }


    // ==========================================
    // PUBLIC - GET CAKE BY ID
    // ==========================================

    @GetMapping("/{id}")
    public ResponseEntity<CakeResponse> getCakeById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                cakeService.getCakeById(id)
        );
    }


    // ==========================================
    // ADMIN - UPDATE CAKE
    // ==========================================

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CakeResponse> updateCake(
            @PathVariable Long id,
            @Valid @RequestBody CakeRequest request) {

        return ResponseEntity.ok(
                cakeService.updateCake(id, request)
        );
    }


    // ==========================================
    // ADMIN - DELETE CAKE
    // ==========================================

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteCake(
            @PathVariable Long id) {

        cakeService.deleteCake(id);

        return ResponseEntity.ok(
                "Cake deleted successfully"
        );
    }


    // ==========================================
    // PUBLIC - SEARCH CAKES
    // ==========================================

    @GetMapping("/search")
    public ResponseEntity<List<CakeResponse>> searchCakes(
            @RequestParam String name) {

        return ResponseEntity.ok(
                cakeService.searchCakes(name)
        );
    }


    // ==========================================
    // PUBLIC - CATEGORY
    // ==========================================

    @GetMapping("/category/{category}")
    public ResponseEntity<List<CakeResponse>> getCakesByCategory(
            @PathVariable String category) {

        return ResponseEntity.ok(
                cakeService.getCakesByCategory(category)
        );
    }


    // ==========================================
    // PUBLIC - AVAILABLE CAKES
    // ==========================================

    @GetMapping("/available")
    public ResponseEntity<List<CakeResponse>> getAvailableCakes() {

        return ResponseEntity.ok(
                cakeService.getAvailableCakes()
        );
    }
}