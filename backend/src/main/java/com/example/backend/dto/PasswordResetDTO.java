package com.example.backend.dto;

import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PasswordResetDTO {

    @NotEmpty(message = "field newPassword cannot be empty")
    private String newPassword;

    @NotEmpty(message = "field token cannot be empty")
    private String token;
}
