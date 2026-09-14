package com.omizoon.CakeService.service;

import org.springframework.stereotype.Service;

import com.omizoon.CakeService.dto.CakeRequest;
import com.omizoon.CakeService.dto.CakeResponse;

import java.util.List;

public interface CakeService {

    CakeResponse createCake(CakeRequest request);

    List<CakeResponse> getAllCakes();

    CakeResponse getCakeById(Long id);

    CakeResponse updateCake(Long id, CakeRequest request);

    void deleteCake(Long id);

    List<CakeResponse> searchCakes(String name);

    List<CakeResponse> getCakesByCategory(String category);

    List<CakeResponse> getAvailableCakes();

}