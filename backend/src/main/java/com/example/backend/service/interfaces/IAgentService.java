package com.example.backend.service.interfaces;

import com.example.backend.dto.AgentDTO;
import com.example.backend.dto.LanguagePreferenceDTO;
import com.example.backend.dto.ThemePreferenceDTO;
import com.example.backend.dto.LoginRequestDTO;
import com.example.backend.dto.TokenResponseDTO;

import java.util.List;

public interface IAgentService {

    AgentDTO createAgent(AgentDTO agentDTO);

    void deleteAgent(Long id);

    AgentDTO updateAgent(AgentDTO agentDTO);

    AgentDTO findAgentById(Long id);

    String updateLanguagePreference(LanguagePreferenceDTO languagePreferenceDTO);

    String updateThemePreference(ThemePreferenceDTO themePreferenceDTO);

    List<AgentDTO> agentList();

    TokenResponseDTO loginAndGenerateToken(LoginRequestDTO loginRequestDTO);

    void resetPassword(String token, String newPassword);
}
