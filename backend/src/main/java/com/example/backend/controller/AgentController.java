package com.example.backend.controller;

import com.example.backend.dto.AgentDTO;
import com.example.backend.service.implementations.AgentServiceImpl;
import com.example.backend.service.implementations.AgentTokenServiceImpl;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@CrossOrigin
@RestController
@RequestMapping("/agent")
public class AgentController {

    private final AgentServiceImpl agentService;
    private final AgentTokenServiceImpl agentTokenService;

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @PostMapping("/create")
    public ResponseEntity<AgentDTO> createAgent(@Valid @RequestBody AgentDTO agentDTO) {
        return new ResponseEntity<>(agentService.createAgent(agentDTO), HttpStatus.CREATED);
    }
}
