package com.example.backend.service.interfaces;

import com.example.backend.dto.RequesterDTO;

import java.util.List;

public interface IRequesterService {

    RequesterDTO createRequester(RequesterDTO requesterDTO);

    void deleteRequester(Long id);

    RequesterDTO updateRequester(RequesterDTO requesterDTO);

    RequesterDTO findRequesterById(Long id);

    List<RequesterDTO> requesterList();
}
