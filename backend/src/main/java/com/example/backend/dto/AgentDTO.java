package com.example.backend.dto;

import com.example.backend.model.AgentTitle;
import com.example.backend.model.UserRole;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.Column;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AgentDTO extends PersonDTO {

    @Schema(example = "john.doe.123")
    @NotNull(message = "field password cannot be empty")
    private String password;

    @Schema(example = "BROKER")
    @NotNull(message = "field agentTitle cannot be empty")
    private AgentTitle agentTitle;

    @Schema(example = "SALES_AGENT")
    @NotNull(message = "field userRole cannot be empty")
    private UserRole userRole;

    @Schema(example = "en")
    @NotNull(message = "field languagePreference cannot be empty")
    private String languagePreference;

    @Schema(example = "light")
    @NotNull(message = "field themePreference cannot be empty")
    private String themePreference;
}
