package com.omizoon.user_service.entity;

import com.omizoon.user_service.Enum.Role;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import jakarta.persistence.Id;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
     private Long id ;


    @Column(nullable = false )
    @NotBlank( message = "First name is required")
    private String    firstname ;

    @NotBlank(message = "Last name is required")
    @Column(nullable = false)
    private String lastName;


    @Column(nullable = false,unique = true)
    @Email( message = "Invalid email")
    private    String email;


    @Column(nullable = false,length = 255)
    @NotBlank( message = "password is required")
     private String password;


    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;



    @Column(nullable = false,unique = true)
   private String  phoneNumber;


    @Builder.Default
    @Column(nullable = false)
    private Boolean enabled = true;


    @Builder.Default
    @Column(nullable = false)
    private Boolean accountLocked = false;

    @CreationTimestamp
    @Column(updatable = false)
    private  LocalDateTime createdAt = LocalDateTime.now();


    @UpdateTimestamp
    private LocalDateTime updatedAt;

}
