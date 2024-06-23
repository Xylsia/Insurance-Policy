package com.example.backend.repository;

import com.example.backend.model.InsurancePolicy;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface IInsurancePolicyRepository extends JpaRepository<InsurancePolicy, Long> {

    @Query("SELECT ip FROM InsurancePolicy ip " +
            "JOIN ip.requester r " +
            "JOIN ip.agent a " +
            "WHERE (:startDate IS NULL OR :endDate IS NULL OR ip.dateCreated BETWEEN :startDate AND :endDate) " +
            "AND (:requesterFirstName IS NULL OR LOWER(r.firstName) = LOWER(:requesterFirstName)) " +
            "AND (:requesterLastName IS NULL OR LOWER(r.lastName) = LOWER(:requesterLastName)) " +
            "AND (:agentFirstName IS NULL OR LOWER(a.firstName) = LOWER(:agentFirstName)) " +
            "AND (:agentLastName IS NULL OR LOWER(a.lastName) = LOWER(:agentLastName)) " +
            "AND (:insuranceItem IS NULL OR LOWER(ip.insuranceItem) = LOWER(:insuranceItem)) " +
            "AND (:estimatedPrice IS NULL OR ip.estimatedPrice = :estimatedPrice)")
    List<InsurancePolicy> filterInsurancePoliciesByParameters(
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            @Param("requesterFirstName") String requesterFirstName,
            @Param("requesterLastName") String requesterLastName,
            @Param("agentFirstName") String agentFirstName,
            @Param("agentLastName") String agentLastName,
            @Param("insuranceItem") String insuranceItem,
            @Param("estimatedPrice") Double estimatedPrice,
            Pageable pageable);

    @Query("SELECT ip FROM InsurancePolicy ip " +
            "JOIN ip.requester r " +
            "JOIN ip.agent a " +
            "WHERE (ip.dateCreated BETWEEN :startDate AND :endDate OR :startDate IS NULL OR :endDate IS NULL)")
    List<InsurancePolicy> findInsurancePoliciesBetweenDates(
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            Pageable pageable
    );

    @Query(value = """
            SELECT ip.*
            FROM insurance_policy ip
            JOIN requester r ON r.id = ip.requester_id
            JOIN agent a ON a.id = ip.agent_id
            WHERE LOCATE(:value, CONCAT_WS(
            '\\ ', ip.date_created, r.first_name, r.last_name, a.first_name, a.last_name,
             ip.insurance_item, ip.estimated_price)) > 0
            """,
            nativeQuery = true)
    List<InsurancePolicy> searchInsurancePolicies(
            @Param("value") String value,
            Pageable pageable
    );
}
