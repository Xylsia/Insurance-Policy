package com.example.backend.service.interfaces;

import com.example.backend.model.Agent;

public interface IAgentTokenService {

    Agent validateToken(String token);
}
