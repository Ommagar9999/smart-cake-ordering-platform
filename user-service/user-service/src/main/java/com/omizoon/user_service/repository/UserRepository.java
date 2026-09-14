package com.omizoon.user_service.repository;

import com.omizoon.user_service.entity.UserEntity;
import org.springframework.data.domain.Example;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<UserEntity , Long>
{

   Optional<UserEntity>  findByEmail(String email);

    boolean existsByEmail(String email);
    boolean existsByPhoneNumber(String PhoneNumber);


}
