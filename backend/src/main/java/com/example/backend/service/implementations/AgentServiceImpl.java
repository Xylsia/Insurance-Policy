package com.example.backend.service.implementations;

import com.example.backend.mapper.IAgentMapper;
import com.example.backend.repository.IAgentRepository;
import com.example.backend.repository.IRequesterRepository;
import com.example.backend.service.interfaces.IAgentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Transactional
@RequiredArgsConstructor
@Service
public class AgentServiceImpl implements IAgentService {

    public final IRequesterRepository requesterRepository;
    public final IAgentRepository agentRepository;
    public final IAgentRepository agentTokenRepository;
    public final IAgentMapper agentMapper;
    public final EmailServiceImpl emailService;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtils;
    private final UserDetailsServiceImpl userDetailsService;
    @Value("${spring.mail.username}")
    private String sender;
}
