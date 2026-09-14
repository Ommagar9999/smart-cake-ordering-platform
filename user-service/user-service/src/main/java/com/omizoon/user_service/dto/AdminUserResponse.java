package com.omizoon.user_service.dto;

import com.omizoon.user_service.Enum.Role;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AdminUserResponse {

    private Long id;
    private String firstname;
    private String lastName;
    private String email;
    private String phoneNumber;
    private Role role;
}