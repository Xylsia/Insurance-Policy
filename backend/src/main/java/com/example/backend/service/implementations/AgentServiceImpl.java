package com.example.backend.service.implementations;

import com.example.backend.config.JwtUtil;
import com.example.backend.dto.*;
import com.example.backend.mapper.IAgentMapper;
import com.example.backend.model.Agent;
import com.example.backend.model.AgentToken;
import com.example.backend.model.Requester;
import com.example.backend.repository.IAgentRepository;
import com.example.backend.repository.IAgentTokenRepository;
import com.example.backend.repository.IRequesterRepository;
import com.example.backend.service.interfaces.IAgentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.*;

@Slf4j
@Transactional
@RequiredArgsConstructor
@Service
public class AgentServiceImpl implements IAgentService {

    public final IRequesterRepository requesterRepository;
    public final IAgentRepository agentRepository;
    public final IAgentTokenRepository agentTokenRepository;
    public final IAgentMapper agentMapper;
    public final EmailServiceImpl emailService;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtils;
    private final UserDetailsServiceImpl userDetailsService;
    @Value("${spring.mail.username}")
    private String sender;

    @Override
    public AgentDTO createAgent(AgentDTO agentDTO) {
        String email =
                agentDTO.getEmail();
        String password = UUID.randomUUID().toString();
        ;
        Optional<Requester> existingRequester = requesterRepository.findByEmail(email);
        Optional<Agent> existingAgent = agentRepository.findByEmail(email);
        if (existingRequester.isPresent()) {
            throw new IllegalArgumentException("Email already exists for a requester.");
        }
        if (existingAgent.isPresent()) {
            throw new IllegalArgumentException("Email already exists for an agent");
        }

        Agent agent = agentMapper.toModel(agentDTO);
        String encodedPassword = passwordEncoder.encode(password);
        agent.setPassword(encodedPassword);
        try {
            agent = agentRepository.save(agent);
        } catch (DataIntegrityViolationException e) {
            throw new IllegalArgumentException("Email already exists.");
        }
        EmailDetailsDTO emailDetails = new EmailDetailsDTO();
        emailDetails.setRecipient(agent.getEmail());
        emailDetails.setSubject("Successful Registration");
        String token = UUID.randomUUID().toString();
        LocalDateTime expiryDate = LocalDateTime.now().plusHours(24);
        String link = "http: //Localhost:8080/api/agent/initial-Login?token=" + token;

        String body =
                "You have been successfully registered. " + "\n\n" + "Use this auto generated " +
                        "password before following the link below to reset your password " + "\n" +
                        "\n" + "Auto generated password: " + password + "\n\n" + "Reset your " +
                        "password on this link: " + link;
        emailDetails.setMsgBody(body);

        emailService.sendSimpleEmail(emailDetails, sender);

        AgentToken agentToken = new AgentToken();
        agentToken.setToken(token);
        agentToken.setExpiryDate(expiryDate);
        agentToken.setAgent(agent);
        agentTokenRepository.save(agentToken);

        return agentMapper.toDTO(agent);
    }

    @Override
    public void deleteAgent(Long id) {
        Optional<Agent> policy = agentRepository.findById(id);
        if (policy.isPresent()) {
            agentRepository.deleteById(id);
        } else {
            throw new NoSuchElementException("Agent with id: " + id + " not found");
        }
    }

    @Override
    public AgentDTO updateAgent(AgentDTO agentDTO) {
        Optional<Agent> agentModel = agentRepository.findById(agentDTO.getId());
        if (agentModel.isEmpty()) {
            throw new NoSuchElementException("Agent with id " + agentDTO.getId() + " not found");
        } else {
            Agent agent = agentModel.get();

            String email = agentDTO.getEmail();
            String password = agentDTO.getPassword();
            Optional<Requester> existingRequester = requesterRepository.findByEmail(email);
            Optional<Agent> existingAgent = agentRepository.findByEmail(email);

            if (existingRequester.isPresent()) {
                throw new IllegalArgumentException("Email already exists for a requester");
            }
            if (existingAgent.isPresent()) {
                throw new IllegalArgumentException("Email already exists for an agent");
            }

            if (Objects.nonNull(agentDTO.getEmail())) {
                String emailRegex = "^[A-Za-z0-9._-]+@[A-Za-z0-9._]+\\.[A-Za-z]{2,6}$";
                if (!email.matches(emailRegex)) {
                    throw new IllegalArgumentException("Email format is not valid");
                }
                agent.setEmail(agentDTO.getEmail());
            }
            if (Objects.nonNull(agentDTO.getPassword())) {
                String passwordRegex = "^(?=.*[0-9])(?=.*[!@#$%^&*/_-])(?=.*[a-zA-Z]).{8,}$";
                if (!password.matches(passwordRegex)) {
                    throw new IllegalArgumentException(
                            "Password must be at least 8 characters " +
                                    "long with at least one special character, one number, one uppercase " +
                                    "letter and one lowercase letter");
                }
                String encodedPassword = passwordEncoder.encode(password);
                agent.setPassword(encodedPassword);
            }
            if (Objects.nonNull(agentDTO.getAgentTitle())) {
                agent.setAgentTitle(agentDTO.getAgentTitle());
            }
            if (Objects.nonNull(agentDTO.getFirstName())) {
                agent.setFirstName(agentDTO.getFirstName());
            }
            if (Objects.nonNull(agentDTO.getLastName())) {
                agent.setLastName(agentDTO.getLastName());
            }
            if (Objects.nonNull(agentDTO.getPhoneNumber())) {
                agent.setPhoneNumber(agentDTO.getPhoneNumber());
            }
            if (Objects.nonNull(agentDTO.getUserRole())) {
                agent.setUserRole(agentDTO.getUserRole());
            }
            if (Objects.nonNull(agentDTO.getLanguagePreference())) {
                agent.setLanguagePreference(agentDTO.getLanguagePreference());
            }
            if (Objects.nonNull(agentDTO.getThemePreference())) {
                agent.setThemePreference(agentDTO.getThemePreference());
            }

            agent = agentRepository.save(agent);
            return agentMapper.toDTO(agent);
        }
    }

    @Override
    public AgentDTO findAgentById(Long id) {
        Optional<Agent> existingAgent = agentRepository.findById(id);
        if (existingAgent.isEmpty()) {
            throw new NoSuchElementException("Agent with id: " + id + " not found");
        } else {
            return agentMapper.toDTO(existingAgent);
        }
    }

    @Override
    public String updateLanguagePreference(LanguagePreferenceDTO languagePreferenceDTO) {
        Optional<Agent> existingAgent = agentRepository.findById(languagePreferenceDTO.getId());

        if (existingAgent.isPresent()) {
            Agent agent = existingAgent.get();
            if (Objects.equals(languagePreferenceDTO.getLanguage(),
                    agent.getLanguagePreference())) {
                return "";
            }

            agent.setLanguagePreference(languagePreferenceDTO.getLanguage());
            agentRepository.save(agent);

            UserDetails userDetails = userDetailsService.loadUserByUsername(agent.getUsername());
            Authentication authentication = new UsernamePasswordAuthenticationToken(
                    userDetails, null, userDetails.getAuthorities());
            return jwtUtils.createToken(authentication);
        } else {
            throw new NoSuchElementException(
                    "Agent with id " + languagePreferenceDTO.getId() + " not found");
        }
    }

    @Override
    public String updateThemePreference(ThemePreferenceDTO themePreferenceDTO) {
        Optional<Agent> existingAgent = agentRepository.findById(themePreferenceDTO.getId());

        if (existingAgent.isPresent()) {
            Agent agent = existingAgent.get();
            if (Objects.equals(themePreferenceDTO.getTheme(), agent.getThemePreference())) {
                return "";
            }

            agent.setThemePreference(themePreferenceDTO.getTheme());
            agentRepository.save(agent);

            UserDetails userDetails = userDetailsService.loadUserByUsername(agent.getUsername());
            Authentication authentication = new UsernamePasswordAuthenticationToken(
                    userDetails, null, userDetails.getAuthorities());
            return jwtUtils.createToken(authentication);
        } else {
            throw new NoSuchElementException(
                    "Agent with id " + themePreferenceDTO.getId() + " not found");
        }
    }

    @Override
    public List<AgentDTO> agentList() {
        List<Agent> agents = agentRepository.findAll();
        return agentMapper.toDTO(agents);
    }

    @Override
    public TokenResponseDTO loginAndGenerateToken(LoginRequestDTO loginRequestDTO) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequestDTO.getEmail(),
                        loginRequestDTO.getPassword()));

        String token = jwtUtils.createToken(authentication);
        return new TokenResponseDTO(token);
    }

    @Override
    public void resetPassword(String token, String newPassword) {
        Optional<AgentToken> existingAgentToken = agentTokenRepository.findByToken(token);
        if (existingAgentToken.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid or Expired Token");
        }

        AgentToken agentToken = existingAgentToken.get();
        if (agentToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Token has Expired");
        }
        Agent agent = agentToken.getAgent();

        String passwordRegex = "^(?=.*[0-9])(?=.*[!@#$%^&*/_-])(?=.*[a-zA-Z]).{8,}$";
        if (!newPassword.matches(passwordRegex)) {
            throw new IllegalArgumentException(
                    "Password must be at least 8 characters " +
                            "long with at least one special character, one number, one uppercase " +
                            "letter and one lowercase letter");
        }
        String encodedPassword = passwordEncoder.encode(newPassword);
        agent.setPassword(encodedPassword);
        agentRepository.save(agent);
        agentTokenRepository.delete(agentToken);
    }
}
