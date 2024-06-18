package com.example.backend.mapper;

import java.util.List;

public interface IMapper<Model, DTO> {

    Model toModel(DTO dto);
    DTO toDTO(Model model);
    List<Model> toModel(List<DTO> dto);
    List<DTO> toDTO(List<Model> model);
}
