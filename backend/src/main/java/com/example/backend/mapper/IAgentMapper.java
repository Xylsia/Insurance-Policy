package com.example.backend.mapper;

import com.example.backend.dto.AgentDTO;
import com.example.backend.model.Agent;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface IAgentMapper extends IMapper<Agent, AgentDTO> {
}
