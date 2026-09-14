package com.omizoon.OrderService.client;

import com.omizoon.OrderService.config.FeignClientConfig;
import com.omizoon.OrderService.dto.UserResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(
        name = "user-Service",
        configuration = FeignClientConfig.class
)
public interface UserClient {

    @GetMapping("/api/users/by-email")
    UserResponse getUserByEmail(
            @RequestParam("email") String email
    );
}