package com.omizoon.CakeService.repository;

import com.omizoon.CakeService.entity.CakeEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CakeRepository extends JpaRepository<CakeEntity,Long> {


    List<CakeEntity> findByNameContainingIgnoreCase(String name);

    List<CakeEntity> findByCategoryIgnoreCase(String category);

    List<CakeEntity> findByAvailableTrue();


}
