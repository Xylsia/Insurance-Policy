package com.example.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "agent")
public class Agent extends Person {

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private AgentTitle agentTitle;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private UserRole userRole;

    @OneToMany(mappedBy = "agent", cascade = CascadeType.REMOVE)
    private Set<InsurancePolicy> policies;

    @Column(nullable = false)
    private String languagePreference;

    @Column(nullable = false)
    private String themePreference;
}
