package com.example.backend.mapper;

import com.example.backend.dto.RequesterDTO;
import com.example.backend.model.Requester;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface IRequesterMapper extends IMapper<Requester, RequesterDTO> {
}
