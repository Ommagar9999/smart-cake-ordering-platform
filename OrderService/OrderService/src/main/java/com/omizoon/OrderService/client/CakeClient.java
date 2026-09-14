package com.omizoon.OrderService.client;

import com.omizoon.OrderService.dto.CakeResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "CakeService")
public interface CakeClient {

    @GetMapping("/api/cakes/{id}")
    CakeResponse getCakeById(@PathVariable Long id);


}