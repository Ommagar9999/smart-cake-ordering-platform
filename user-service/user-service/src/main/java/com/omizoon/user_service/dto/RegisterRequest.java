package com.omizoon.user_service.dto;


import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RegisterRequest {


   @NotBlank(message = "First name is required")
   private String firstName;

  @NotBlank(message = "Last name is required ")
  private  String  lastName;

  @NotBlank(message = " email is required ")
  @Email(message = "Invalid email")
  private  String email;

    @NotBlank(message = "Password is required")
    private  String  password;

    @NotBlank(message = "Phone number is required")
    private  String  phoneNumber;



}
