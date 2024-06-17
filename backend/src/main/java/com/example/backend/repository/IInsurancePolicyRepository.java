package com.example.backend.repository;

import com.example.backend.model.InsurancePolicy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IInsurancePolicyRepository extends JpaRepository<InsurancePolicy, Long> {

}
