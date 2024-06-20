package com.example.backend.service.implementations;

import com.example.backend.model.Agent;
import com.example.backend.repository.IAgentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.Collections;

@RequiredArgsConstructor
@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    private final IAgentRepository agentRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Agent agent = agentRepository.findByUsername(username);
        if (agent == null) {
            throw new UsernameNotFoundException("Agent with username: " + username + " not found");
        }
        Collection<? extends GrantedAuthority> authorities = getAuthorities(agent);
        return new User(agent.getEmail(), agent.getPassword(), authorities);
    }

    private Collection<? extends GrantedAuthority> getAuthorities(Agent agent) {
        return Collections.singletonList(
                new SimpleGrantedAuthority("ROLE_" + agent.getUserRole().name()));
    }
}
