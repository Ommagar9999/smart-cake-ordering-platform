package com.omizoon.user_service.service;



import com.omizoon.user_service.dto.AdminUserResponse;

import java.util.List;

public interface AdminService {

    List<AdminUserResponse> getAllUsers();

    void deleteUser(Long id);
}