package com.example.backend.service.interfaces;

import com.example.backend.dto.*;

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

    void resetPassword(PasswordResetDTO passwordResetDTO);
}
