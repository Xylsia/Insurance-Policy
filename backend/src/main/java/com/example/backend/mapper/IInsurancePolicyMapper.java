package com.example.backend.mapper;

import com.example.backend.dto.InsurancePolicyDTO;
import com.example.backend.model.InsurancePolicy;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface IInsurancePolicyMapper extends IMapper<InsurancePolicy, InsurancePolicyDTO> {
}
