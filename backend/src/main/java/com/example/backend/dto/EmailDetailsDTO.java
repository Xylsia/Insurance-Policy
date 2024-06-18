package com.example.backend.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class EmailDetailsDTO {

    @Schema(example = "jane.doe@example.com")
    @NotNull(message = "field recipient cannot be empty")
    private String recipient;

    @Schema(example = "email body text")
    private String msgBody;

    @Schema(example = "subject text")
    @NotNull(message = "field subject cannot be empty")
    private String subject;
}
