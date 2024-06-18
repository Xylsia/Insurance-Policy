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
public class ThemePreferenceDTO {

    @NotEmpty(message = "field id cannot be empty")
    private Long id;

    @NotEmpty(message = "field theme cannot be empty")
    private String theme;
}
