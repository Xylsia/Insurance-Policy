package com.example.backend.controller;

import com.example.backend.dto.InsurancePolicyDTO;
import com.example.backend.model.CoverageType;
import com.example.backend.model.InsuranceItem;
import com.example.backend.service.implementations.InsurancePolicyServiceImpl;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@CrossOrigin
@RestController
@RequestMapping("/insurance-policy")
public class InsurancePolicyController {

    private final InsurancePolicyServiceImpl insurancePolicyService;

    @Operation(summary = "Get the list of insurance policies", security = @SecurityRequirement(name = "Bearer Authentication"))
    @PreAuthorize("hasAnyRole('SALES_AGENT', 'ADMIN')")
    @GetMapping("/list")
    public ResponseEntity<List<InsurancePolicyDTO>> insurancePolicyList() {
        List<InsurancePolicyDTO> insurancePolicyDTOs = insurancePolicyService.insurancePolicyList();
        return new ResponseEntity<>(insurancePolicyDTOs, HttpStatus.OK);
    }

    @Operation(summary = "Find an insurance policy by ID", security = @SecurityRequirement(name = "Bearer Authentication"))
    @PreAuthorize("hasAnyRole('SALES_AGENT', 'ADMIN')")
    @GetMapping("/id/{id}")
    public ResponseEntity<InsurancePolicyDTO> findInsurancePolicyById(@PathVariable("id") Long id) {
        InsurancePolicyDTO insurancePolicyDTO = insurancePolicyService.findInsurancePolicyById(id);
        return new ResponseEntity<>(insurancePolicyDTO, HttpStatus.OK);
    }

    @Operation(summary = "Delete an insurance policy by ID", security = @SecurityRequirement(name = "Bearer Authentication"))
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteInsurancePolicy(@PathVariable("id") Long id) {
        insurancePolicyService.deleteInsurancePolicy(id);
        return ResponseEntity.ok("Insurance Policy with id: " + id + " has been deleted");
    }

    @Operation(summary = "Create a new insurance policy", security = @SecurityRequirement(name = "Bearer Authentication"))
    @PreAuthorize("hasAnyRole('SALES_AGENT', 'ADMIN')")
    @PostMapping("/create")
    public ResponseEntity<InsurancePolicyDTO> createInsurancePolicy
            (@Valid @RequestBody InsurancePolicyDTO insurancePolicyDTO) {
        return new ResponseEntity<>(
                insurancePolicyService.createInsurancePolicy(insurancePolicyDTO),
                HttpStatus.CREATED);
    }

    @Operation(summary = "Update an existing insurance policy", security = @SecurityRequirement(name = "Bearer Authentication"))
    @PreAuthorize("hasAnyRole('SALES_AGENT', 'ADMIN')")
    @PatchMapping("/update")
    public ResponseEntity<InsurancePolicyDTO> updateInsurancePolicy(
            @RequestBody InsurancePolicyDTO insurancePolicyDTO) {
        InsurancePolicyDTO updatedPolicy =
                insurancePolicyService.updateInsurancePolicy(insurancePolicyDTO);
        return new ResponseEntity<>(updatedPolicy, HttpStatus.OK);
    }

    @Operation(summary = "Search insurance policies", security = @SecurityRequirement(name = "Bearer Authentication"))
    @PreAuthorize("hasAnyRole('SALES_AGENT', 'ADMIN')")
    @GetMapping("/search")
    public ResponseEntity<List<InsurancePolicyDTO>> searchInsurancePolicies(
            @RequestParam(defaultValue = "") String value,
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "10") Integer pageSize,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortType) {

        List<InsurancePolicyDTO> insurancePolicyDTOs =
                insurancePolicyService.searchInsurancePolicies(value, page, pageSize, sortBy,
                        sortType);

        return ResponseEntity.ok(insurancePolicyDTOs);
    }

    @Operation(summary = "Find insurance policies between dates", security = @SecurityRequirement(name = "Bearer Authentication"))
    @PreAuthorize("hasAnyRole('SALES_AGENT', 'ADMIN')")
    @GetMapping("/find-between-dates")
    public ResponseEntity<List<InsurancePolicyDTO>> findInsurancePoliciesBetweenDates(
            @RequestParam(required = false) LocalDate startDate,
            @RequestParam(required = false) LocalDate endDate,
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "10") Integer pageSize,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortType) {

        pageSize = Integer.MAX_VALUE;
        List<InsurancePolicyDTO> insurancePolicyDTOs =
                insurancePolicyService.findInsurancePoliciesBetweenDates(
                        startDate, endDate, page, pageSize, sortBy, sortType);

        return ResponseEntity.ok(insurancePolicyDTOs);
    }

    @Operation(summary = "Filter insurance policies by parameters", security = @SecurityRequirement(name = "Bearer Authentication"))
    @PreAuthorize("hasAnyRole('SALES_AGENT', 'ADMIN')")
    @GetMapping("/filter-by-params")
    public ResponseEntity<List<InsurancePolicyDTO>> filterInsurancePoliciesByParameters(
            @RequestParam(required = false) LocalDate startDate,
            @RequestParam(required = false) LocalDate endDate,
            @RequestParam(required = false) String requesterFirstName,
            @RequestParam(required = false) String requesterLastName,
            @RequestParam(required = false) String agentFirstName,
            @RequestParam(required = false) String agentLastName,
            @RequestParam(required = false) String insuranceItem,
            @RequestParam(required = false) Double estimatedPrice,
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "10") Integer pageSize,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortType) {

        List<InsurancePolicyDTO> insurancePolicyDTOs =
                insurancePolicyService.filterInsurancePoliciesByParameters(
                        startDate, endDate, requesterFirstName, requesterLastName,
                        agentFirstName, agentLastName, insuranceItem, estimatedPrice,
                        page, pageSize, sortBy, sortType);

        return ResponseEntity.ok(insurancePolicyDTOs);
    }

    @Operation(summary = "Filter coverages by item type", security = @SecurityRequirement(name = "Bearer Authentication"))
    @PreAuthorize("hasAnyRole('SALES_AGENT', 'ADMIN')")
    @GetMapping("/coverage-types/{itemType}")
    public ResponseEntity<List<CoverageType>> filterCoveragesByItemType(
            @PathVariable("itemType") String itemType) {
        InsuranceItem insuranceItem = InsuranceItem.valueOf(itemType.toUpperCase());
        List<CoverageType> coverageTypes =
                insurancePolicyService.filterCoveragesByItemType(insuranceItem);
        return ResponseEntity.ok(coverageTypes);
    }

    @Operation(summary = "Get the list of insurance items", security = @SecurityRequirement(name = "Bearer Authentication"))
    @PreAuthorize("hasAnyRole('SALES_AGENT', 'ADMIN')")
    @GetMapping("/insurance-items")
    public InsuranceItem[] getInsuranceItems() {
        return InsuranceItem.values();
    }
}
