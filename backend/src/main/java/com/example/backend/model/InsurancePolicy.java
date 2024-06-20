package com.example.backend.model;

import jakarta.persistence.*;
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
@Entity
@Table(name = "insurance_policy")
public class InsurancePolicy {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDate dateCreated;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "agent_id", referencedColumnName = "id")
    private Agent agent;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "requester_id", referencedColumnName = "id")
    private Requester requester;

    @ElementCollection(targetClass = CoverageType.class)
    @CollectionTable(name = "insurance_policy_coverage", joinColumns = @JoinColumn(name = "insurance_policy_id"))
    @Enumerated(EnumType.STRING)
    private Set<CoverageType> coverages;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private InsuranceItem insuranceItem;

    @Column(nullable = false)
    private Double estimatedPrice;

    @Column(nullable = false)
    private Double lossPriceRangeMin;

    @Column(nullable = false)
    private Double lossPriceRangeMax;
}
