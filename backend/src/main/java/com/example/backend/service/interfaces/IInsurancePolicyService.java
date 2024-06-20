package com.example.backend.service.interfaces;

import com.example.backend.dto.InsurancePolicyDTO;
import com.example.backend.model.CoverageType;
import com.example.backend.model.InsuranceItem;
import com.example.backend.model.InsurancePolicy;

import java.time.LocalDate;
import java.util.List;

public interface IInsurancePolicyService {

    List<InsurancePolicyDTO> insurancePolicyList();

    InsurancePolicyDTO findInsurancePolicyById(Long id);

    void deleteInsurancePolicy(Long id);

    InsurancePolicyDTO createInsurancePolicy(InsurancePolicyDTO insurancePolicyDTO);

    InsurancePolicyDTO updateInsurancePolicy(InsurancePolicyDTO insurancePolicyDTO);

    List<InsurancePolicyDTO> searchInsurancePolicies(
            String value,
            Integer page,
            Integer pageSize,
            String sortBy,
            String sortType);

    List<InsurancePolicyDTO> findInsurancePoliciesBetweenDates(
            LocalDate startDate,
            LocalDate endDate,
            Integer page,
            Integer pageSize,
            String sortBy,
            String sortType);

    List<InsurancePolicyDTO> filterInsurancePoliciesByParameters(
            LocalDate startDate,
            LocalDate endDate,
            String requesterFirstName,
            String requesterLastName,
            String agentFirstName,
            String agentLastName,
            String insuranceItem,
            Double estimatedPrice,
            Integer page,
            Integer pageSize,
            String sortBy,
            String sortType);

    List<CoverageType> filterCoveragesByItemType(InsuranceItem item);
}
