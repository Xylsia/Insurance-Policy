package com.example.backend.dto;

import com.example.backend.model.CoverageType;
import com.example.backend.model.InsuranceItem;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class InsurancePolicyDTO {

    @Schema(example = "10")
    private Long id;

    @Schema(example = "2022-01-01")
    @NotNull(message = "field dateCreated cannot be empty")
    private LocalDate dateCreated;

    @NotNull(message = "field agent cannot be empty")
    private AgentDTO agent;

    @NotNull(message = "field agent cannot be empty")
    private RequesterDTO requester;

    @Schema(example = "BASIC")
    @NotNull(message = "field coverages cannot be empty")
    private Set<CoverageType> coverages;

    @Schema(example = "HOUSE")
    @NotNull(message = "field insuranceItem cannot be empty")
    private InsuranceItem insuranceItem;

    @Schema(example = "1500.0")
    @PositiveOrZero
    @NotNull(message = "field estimatedPrice cannot be empty")
    private Double estimatedPrice;

    @Schema(example = "500.0")
    @PositiveOrZero
    @NotNull(message = "field lossPriceRangeMin cannot be empty")
    private Double lossPriceRangeMin;

    @Schema(example = "3000.0")
    @PositiveOrZero
    @NotNull(message = "field lossPriceRangeMax cannot be empty")
    private Double lossPriceRangeMax;
}
