package com.example.backend.controller;

import com.example.backend.dto.*;
import com.example.backend.model.AgentTitle;
import com.example.backend.model.UserRole;
import com.example.backend.service.implementations.AgentServiceImpl;
import com.example.backend.service.implementations.AgentTokenServiceImpl;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Map;

@RequiredArgsConstructor
@CrossOrigin
@RestController
@RequestMapping("/agent")
public class AgentController {

    private final AgentServiceImpl agentService;
    private final AgentTokenServiceImpl agentTokenService;


    @Operation(summary = "Create an agent", security = @SecurityRequirement(name = "Bearer Authentication"))
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/create")
    public ResponseEntity<AgentDTO> createAgent(@Valid @RequestBody AgentDTO agentDTO) {
        return new ResponseEntity<>(agentService.createAgent(agentDTO), HttpStatus.CREATED);
    }

    @Operation(summary = "Delete an agent by ID", security = @SecurityRequirement(name = "Bearer Authentication"))
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteAgent(@PathVariable("id") Long id) {
        agentService.deleteAgent(id);
        return ResponseEntity.ok("Agent with id: " + id + " has been deleted");
    }

    @Operation(summary = "Update an agent", security = @SecurityRequirement(name = "Bearer Authentication"))
    @PreAuthorize("hasAnyRole('SALES_AGENT', 'ADMIN')")
    @PatchMapping("/update")
    public ResponseEntity<AgentDTO> updateAgent(@RequestBody AgentDTO agentDTO) {
        return new ResponseEntity<>(agentService.updateAgent(agentDTO), HttpStatus.OK);
    }

    @Operation(summary = "Find an agent by ID", security = @SecurityRequirement(name = "Bearer Authentication"))
    @PreAuthorize("hasAnyRole('SALES_AGENT', 'ADMIN')")
    @GetMapping("/id/{id}")
    public ResponseEntity<AgentDTO> findAgentById(@PathVariable("id") Long id) {
        return new ResponseEntity<>(agentService.findAgentById(id), HttpStatus.OK);
    }

    @Operation(summary = "Initial login with a token")
    @GetMapping("/initial-login")
    public ResponseEntity<String> initialLogin(@RequestParam("token") String token) {
        agentTokenService.validateToken(token);
        return ResponseEntity.ok("Token is valid. Agent Logged in successfully");
    }

    @Operation(summary = "Reset password for an agent")
    @PostMapping("/reset-password")
    public ResponseEntity<String> createAgent(@RequestBody PasswordResetDTO passwordResetDTO) {
        agentService.resetPassword(passwordResetDTO);
        return ResponseEntity.ok("Password reset has been successful");
    }

    @Operation(summary = "Get the list of agents", security = @SecurityRequirement(name = "Bearer Authentication"))
    @PreAuthorize("hasAnyRole('SALES_AGENT', 'ADMIN')")
    @GetMapping("/list")
    public ResponseEntity<List<AgentDTO>> agentList() {
        List<AgentDTO> agentDTOs = agentService.agentList();
        return new ResponseEntity<>(agentDTOs, HttpStatus.OK);
    }

    @Operation(summary = "Login an agent and generate a token")
    @PostMapping("/login")
    public ResponseEntity<TokenResponseDTO> login(@RequestBody LoginRequestDTO loginRequestDTO) {
        return ResponseEntity.ok(agentService.loginAndGenerateToken(loginRequestDTO));
    }

    @Operation(summary = "Get the list of agent titles", security = @SecurityRequirement(name = "Bearer Authentication"))
    @PreAuthorize("hasAnyRole('SALES_AGENT', 'ADMIN')")
    @GetMapping("/agent-titles")
    public AgentTitle[] getAgentTitles() {
        return AgentTitle.values();
    }

    @Operation(summary = "Get the list of user roles", security = @SecurityRequirement(name = "Bearer Authentication"))
    @PreAuthorize("hasAnyRole('SALES_AGENT', 'ADMIN')")
    @GetMapping("/user-roles")
    public UserRole[] getUserRoles() {
        return UserRole.values();
    }

    @Operation(summary = "Update language preference", security = @SecurityRequirement(name = "Bearer Authentication"))
    @PreAuthorize("hasAnyRole('SALES_AGENT', 'ADMIN')")
    @PutMapping("/language-preference")
    public ResponseEntity<Map<String, String>> updateLanguagePreference(
            @RequestBody LanguagePreferenceDTO languagePreferenceDTO) {
        String newToken = agentService.updateLanguagePreference(languagePreferenceDTO);
        return ResponseEntity.ok(Collections.singletonMap("token", newToken));
    }

    @Operation(summary = "Update theme preference", security = @SecurityRequirement(name = "Bearer " +
            "Authentication"))
    @PreAuthorize("hasAnyRole('SALES_AGENT', 'ADMIN')")
    @PutMapping("/theme-preference")
    public ResponseEntity<Map<String, String>> updateThemePreference(
            @RequestBody ThemePreferenceDTO themePreferenceDTO) {
        String newToken = agentService.updateThemePreference(themePreferenceDTO);
        return ResponseEntity.ok(Collections.singletonMap("token", newToken));
    }
}
