package com.example.backend.service.implementations;

import com.example.backend.dto.InsurancePolicyDTO;
import com.example.backend.mapper.IAgentMapper;
import com.example.backend.mapper.IInsurancePolicyMapper;
import com.example.backend.mapper.IRequesterMapper;
import com.example.backend.model.*;
import com.example.backend.repository.IAgentRepository;
import com.example.backend.repository.IInsurancePolicyRepository;
import com.example.backend.repository.IRequesterRepository;
import com.example.backend.service.interfaces.IInsurancePolicyService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;

@Slf4j
@RequiredArgsConstructor
@Transactional
@Service
public class InsurancePolicyServiceImpl implements IInsurancePolicyService {

    private final IInsurancePolicyRepository insurancePolicyRepository;
    private final IAgentRepository agentRepository;
    private final IRequesterRepository requesterRepository;
    private final IInsurancePolicyMapper insurancePolicyMapper;
    private final IAgentMapper agentMapper;
    private final IRequesterMapper requesterMapper;

    @Override
    public List<InsurancePolicyDTO> insurancePolicyList() {
        List<InsurancePolicy> insurancePolicies = insurancePolicyRepository.findAll();
        return insurancePolicyMapper.toDTO(insurancePolicies);
    }

    @Override
    public InsurancePolicyDTO findInsurancePolicyById(Long id) {
        Optional<InsurancePolicy> existingPolicy = insurancePolicyRepository.findById(id);
        if (existingPolicy.isEmpty()) {
            throw new NoSuchElementException("Insurance Policy with id: " + id + " was not found");
        } else {
            return insurancePolicyMapper.toDTO(existingPolicy.get());
        }
    }

    @Override
    public void deleteInsurancePolicy(Long id) {
        Optional<InsurancePolicy> existingPolicy = insurancePolicyRepository.findById(id);
        if (existingPolicy.isPresent()) {
            insurancePolicyRepository.deleteById(id);
        } else {
            throw new NoSuchElementException("Insurance Policy with id: " + id + " was not found");
        }
    }

    @Override
    public InsurancePolicyDTO createInsurancePolicy(InsurancePolicyDTO insurancePolicyDTO) {
        InsurancePolicy insurancePolicy = insurancePolicyMapper.toModel(insurancePolicyDTO);

        Optional<Agent> existingAgent =
                agentRepository.findById(insurancePolicyDTO.getAgent().getId());
        Optional<Requester> existingRequester =
                requesterRepository.findById(insurancePolicyDTO.getRequester().getId());
        if (existingAgent.isEmpty()) {
            throw new NoSuchElementException("Agent not found");
        }
        if (existingRequester.isEmpty()) {
            throw new NoSuchElementException("Requester not found");
        }

        Agent agent = existingAgent.get();
        Requester requester = existingRequester.get();

        insurancePolicy.setAgent(agent);
        insurancePolicy.setRequester(requester);
        insurancePolicy = insurancePolicyRepository.save(insurancePolicy);

        return insurancePolicyMapper.toDTO(insurancePolicy);
    }

    @Override
    public InsurancePolicyDTO updateInsurancePolicy(InsurancePolicyDTO insurancePolicyDTO) {
        Optional<InsurancePolicy> existingPolicy =
                insurancePolicyRepository.findById(insurancePolicyDTO.getId());
        if (existingPolicy.isEmpty()) {
            throw new NoSuchElementException(
                    "Insurance Policy with id: " + insurancePolicyDTO.getId() + " not found");
        } else {
            InsurancePolicy insurancePolicy = existingPolicy.get();

            if (Objects.nonNull(insurancePolicyDTO.getDateCreated())) {
                insurancePolicy.setDateCreated(insurancePolicyDTO.getDateCreated());
            }
            if (Objects.nonNull(insurancePolicyDTO.getAgent())) {
                insurancePolicy.setAgent(agentMapper.toModel(insurancePolicyDTO.getAgent()));
            }
            if (Objects.nonNull(insurancePolicyDTO.getRequester())) {
                insurancePolicy.setRequester(
                        requesterMapper.toModel(insurancePolicyDTO.getRequester()));
            }
            if (Objects.nonNull(insurancePolicyDTO.getCoverages())) {
                insurancePolicy.setCoverages(insurancePolicyDTO.getCoverages());
            }
            if (Objects.nonNull(insurancePolicyDTO.getInsuranceItem())) {
                insurancePolicy.setInsuranceItem(insurancePolicyDTO.getInsuranceItem());
            }
            if (Objects.nonNull(insurancePolicyDTO.getEstimatedPrice())) {
                insurancePolicy.setEstimatedPrice(insurancePolicyDTO.getEstimatedPrice());
            }
            if (Objects.nonNull(insurancePolicyDTO.getLossPriceRangeMin())) {
                insurancePolicy.setLossPriceRangeMin(insurancePolicyDTO.getLossPriceRangeMin());
            }
            if (Objects.nonNull(insurancePolicyDTO.getLossPriceRangeMax())) {
                insurancePolicy.setLossPriceRangeMax(insurancePolicyDTO.getLossPriceRangeMax());
            }

            insurancePolicy = insurancePolicyRepository.save(insurancePolicy);
            return insurancePolicyMapper.toDTO(insurancePolicy);
        }
    }

    @Override
    public List<InsurancePolicyDTO> searchInsurancePolicies(
            String value,
            Integer page,
            Integer pageSize,
            String sortBy,
            String sortType) {

        Pageable pageable = switch (sortType) {
            case "asc" -> PageRequest.of(page, pageSize, Sort.by(sortBy).ascending());
            case "desc" -> PageRequest.of(page, pageSize, Sort.by(sortBy).descending());
            default -> PageRequest.of(page, pageSize, Sort.by(sortBy));
        };

        List<InsurancePolicy> insurancePolicies =
                insurancePolicyRepository.searchInsurancePolicies(value, pageable);
        return insurancePolicyMapper.toDTO(insurancePolicies);
    }

    @Override
    public List<InsurancePolicyDTO> findInsurancePoliciesBetweenDates(
            LocalDate startDate,
            LocalDate endDate,
            Integer page,
            Integer pageSize,
            String sortBy,
            String sortType) {

        Pageable pageable = switch (sortType) {
            case "asc" -> PageRequest.of(page, pageSize, Sort.by(sortBy).ascending());
            case "desc" -> PageRequest.of(page, pageSize, Sort.by(sortBy).descending());
            default -> PageRequest.of(page, pageSize, Sort.by(sortBy));
        };

        List<InsurancePolicy> insurancePolicies =
                insurancePolicyRepository.findInsurancePoliciesBetweenDates(startDate, endDate,
                        pageable);
        return insurancePolicyMapper.toDTO(insurancePolicies);

    }

    @Override
    public List<InsurancePolicyDTO> filterInsurancePoliciesByParameters(
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
            String sortType) {

        Pageable pageable = switch (sortType) {
            case "asc" -> PageRequest.of(page, pageSize, Sort.by(sortBy).ascending());
            case "desc" -> PageRequest.of(page, pageSize, Sort.by(sortBy).descending());
            default -> PageRequest.of(page, pageSize, Sort.by(sortBy));
        };

        List<InsurancePolicy> insurancePolicies =
                insurancePolicyRepository.filterInsurancePoliciesByParameters(startDate, endDate,
                        requesterFirstName, requesterLastName, agentFirstName, agentLastName,
                        insuranceItem, estimatedPrice, pageable);
        return insurancePolicyMapper.toDTO(insurancePolicies);
    }

    @Override
    public List<CoverageType> filterCoveragesByItemType(InsuranceItem item) {
        List<CoverageType> filteredCoverages;

        switch (item) {
            case CAR:
                filteredCoverages = Arrays.asList(
                        CoverageType.TRAFFIC_ACCIDENT,
                        CoverageType.THEFT,
                        CoverageType.FIRE);
                break;
            case HOUSE:
                filteredCoverages = Arrays.asList(
                        CoverageType.FIRE,
                        CoverageType.NATURAL_DISASTER,
                        CoverageType.BUILDING_INSURANCE,
                        CoverageType.LANDLORD_INSURANCE);
                break;
            case HEALTH:
                filteredCoverages = Arrays.asList(
                        CoverageType.BASIC,
                        CoverageType.PRIVATE,
                        CoverageType.PUBLIC,
                        CoverageType.ADVANCED);
                break;
            case JEWELRY:
                filteredCoverages = Arrays.asList(
                        CoverageType.THEFT,
                        CoverageType.SHIPPING);
                break;
            case BUSINESS:
                filteredCoverages = Arrays.asList(
                        CoverageType.FIRE,
                        CoverageType.NATURAL_DISASTER,
                        CoverageType.BUILDING_INSURANCE,
                        CoverageType.CYBER,
                        CoverageType.CREDIT_RISK,
                        CoverageType.BUSINESS_PROPERTY);
                break;
            case TRAVEL:
                filteredCoverages = Arrays.asList(
                        CoverageType.BASIC,
                        CoverageType.ADVANCED,
                        CoverageType.SHIPPING);
                break;
            default:
                throw new NoSuchElementException("Invalid item type: " + item);
        }
        return filteredCoverages;
    }
}
