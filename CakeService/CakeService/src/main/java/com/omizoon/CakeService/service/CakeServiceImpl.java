package com.omizoon.CakeService.service;

import com.omizoon.CakeService.dto.CakeRequest;
import com.omizoon.CakeService.dto.CakeResponse;
import com.omizoon.CakeService.entity.CakeEntity;
import com.omizoon.CakeService.exception.CakeNotFoundException;
import com.omizoon.CakeService.repository.CakeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CakeServiceImpl implements CakeService {

    private final CakeRepository cakeRepository;

    @Override
    public CakeResponse createCake(CakeRequest request) {

        CakeEntity cake = CakeEntity.builder()
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .imageUrl(request.getImageUrl())
                .category(request.getCategory())
                .available(request.getAvailable() != null
                        ? request.getAvailable()
                        : true)
                .build();

        CakeEntity savedCake = cakeRepository.save(cake);

        return mapToResponse(savedCake);
    }

    @Override
    public List<CakeResponse> getAllCakes() {

        return cakeRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public CakeResponse getCakeById(Long id) {

        CakeEntity cake = cakeRepository.findById(id)
                .orElseThrow(() ->
                        new CakeNotFoundException("Cake not found with id: " + id));
        return mapToResponse(cake);
    }

    @Override
    public CakeResponse updateCake(Long id, CakeRequest request) {

        CakeEntity cake = cakeRepository.findById(id)
                .orElseThrow(() ->
                        new CakeNotFoundException("Cake not found with id: " + id));
        cake.setName(request.getName());
        cake.setDescription(request.getDescription());
        cake.setPrice(request.getPrice());
        cake.setImageUrl(request.getImageUrl());
        cake.setCategory(request.getCategory());
        if (request.getAvailable() != null) {
            cake.setAvailable(request.getAvailable());
        }


        CakeEntity updatedCake = cakeRepository.save(cake);

        return mapToResponse(updatedCake);
    }

    @Override
    public void deleteCake(Long id) {

        CakeEntity cake = cakeRepository.findById(id)
                .orElseThrow(() ->
                        new CakeNotFoundException("Cake not found with id: " + id));
        cakeRepository.delete(cake);
    }

    @Override
    public List<CakeResponse> searchCakes(String name) {

        return cakeRepository.findByNameContainingIgnoreCase(name)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public List<CakeResponse> getCakesByCategory(String category) {

        return cakeRepository.findByCategoryIgnoreCase(category)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public List<CakeResponse> getAvailableCakes() {

        return cakeRepository.findByAvailableTrue()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    private CakeResponse mapToResponse(CakeEntity cake) {

        return CakeResponse.builder()
                .id(cake.getId())
                .name(cake.getName())
                .description(cake.getDescription())
                .price(cake.getPrice())
                .imageUrl(cake.getImageUrl())
                .category(cake.getCategory())
                .available(cake.getAvailable())
                .createdAt(cake.getCreatedAt())
                .updatedAt(cake.getUpdatedAt())
                .build();
    }
}