package com.example.backend.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public abstract class PersonDTO {

    @Schema(example = "10")
    private Long id;

    @Schema(example = "John")
    @NotEmpty(message = "field firstName cannot be empty")
    private String firstName;

    @Schema(example = "Doe")
    @NotEmpty(message = "field lastName cannot be empty")
    private String lastName;

    @Schema(example = "john.doe@example.com")
    @Email(message = "email format should be valid")
    @NotEmpty(message = "field email cannot be empty")
    private String email;

    @Schema(example = "123-123-1234")
    @NotEmpty(message = "field phoneNumber cannot be empty")
    private String phoneNumber;
}
