package com.omizoon.user_service.controller;

import com.omizoon.user_service.dto.AdminUserResponse;
import com.omizoon.user_service.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/test")
    public String adminTest() {
        return "ADMIN Authorization is working!";
    }

    @GetMapping("/users")
    public List<AdminUserResponse> getUsers() {
        return adminService.getAllUsers();
    }

    @DeleteMapping("/users/{id}")
    public String deleteUser(@PathVariable Long id) {

        adminService.deleteUser(id);

        return "User deleted successfully";
    }
}