package com.omizoon.user_service.dto;

import com.omizoon.user_service.Enum.Role;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AuthResponse {

    private   String  token;
    private  String message;
    private Role role;


}
