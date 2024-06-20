package com.example.backend.service.implementations;

import com.example.backend.model.Agent;
import com.example.backend.model.AgentToken;
import com.example.backend.repository.IAgentTokenRepository;
import com.example.backend.service.interfaces.IAgentTokenService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;

@RequiredArgsConstructor
@Service
public class AgentTokenServiceImpl implements IAgentTokenService {

    private final IAgentTokenRepository agentTokenRepository;

    @Override
    public Agent validateToken(String token) {
        AgentToken agentToken = agentTokenRepository.findByToken(token).orElseThrow(
                () -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Token has expired"));

        if (agentToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Token has expired");
        }
        return agentToken.getAgent();
    }
}
