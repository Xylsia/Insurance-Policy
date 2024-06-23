package com.example.backend.repository;

import com.example.backend.model.Agent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface IAgentRepository extends JpaRepository<Agent, Long> {

    Agent findByEmail(String email);
}
