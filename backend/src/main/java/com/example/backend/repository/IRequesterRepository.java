package com.example.backend.repository;

import com.example.backend.model.Requester;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface IRequesterRepository extends JpaRepository<Requester, Long> {
    Optional<Requester> findByEmail(String email);
}
