package com.example.backend.service.implementations;

import com.example.backend.dto.RequesterDTO;
import com.example.backend.mapper.IRequesterMapper;
import com.example.backend.model.Agent;
import com.example.backend.model.Requester;
import com.example.backend.repository.IAgentRepository;
import com.example.backend.repository.IRequesterRepository;
import com.example.backend.service.interfaces.IRequesterService;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Objects;
import java.util.Optional;

@Transactional
@RequiredArgsConstructor
@Service
public class RequesterServiceImpl implements IRequesterService {

    private final IRequesterRepository requesterRepository;
    private final IRequesterMapper requesterMapper;
    private final IAgentRepository agentRepository;

    @Override
    public RequesterDTO createRequester(RequesterDTO requesterDTO) {
        String requesterEmail = requesterDTO.getEmail();
        Optional<Requester> existingRequester = requesterRepository.findByEmail(requesterEmail);
        Optional<Agent> existingAgent = agentRepository.findByEmail(requesterEmail);

        if (existingRequester.isPresent()) {
            throw new IllegalArgumentException("Email already exists for a requester in database");
        }
        if (existingAgent.isPresent()) {
            throw new IllegalArgumentException("Email already exists for an agent in database");
        }

        Requester requester = requesterMapper.toModel(requesterDTO);
        try {
            requester = requesterRepository.save(requester);
        } catch (DataIntegrityViolationException e) {
            throw new IllegalArgumentException(e.getMessage(), e);
        }
        return requesterMapper.toDTO(requester);
    }

    @Override
    public void deleteRequester(Long id) {
        Optional<Requester> requester = requesterRepository.findById(id);
        if (requester.isPresent()) {
            requesterRepository.deleteById(id);
        } else {
            throw new NoSuchElementException("Requester with id: " + id + " not found");
        }
    }

    @Override
    public RequesterDTO updateRequester(RequesterDTO requesterDTO) {
        Optional<Requester> existingRequester = requesterRepository.findById(requesterDTO.getId());

        if (existingRequester.isEmpty()) {
            throw new NoSuchElementException(
                    "Requester with id: " + requesterDTO.getId() + " not" + " found");
        } else {
            Requester requester = existingRequester.get();
            String requesterEmail = requesterDTO.getEmail();
            Optional<Requester> existingRequesterEmail =
                    requesterRepository.findByEmail(requesterEmail);
            Optional<Agent> existingAgent = agentRepository.findByEmail(requesterEmail);

            if (existingRequesterEmail.isPresent()) {
                throw new IllegalArgumentException(
                        "Email already exists for a requester in " + "database");
            }
            if (existingAgent.isPresent()) {
                throw new IllegalArgumentException("Email already exists for an agent in database");
            }

            if (Objects.nonNull(requesterDTO.getEmail())) {
                requester.setEmail(requesterDTO.getEmail());
            }
            if (Objects.nonNull(requesterDTO.getFirstName())) {
                requester.setFirstName(requesterDTO.getFirstName());
            }
            if (Objects.nonNull(requesterDTO.getLastName())) {
                requester.setLastName(requesterDTO.getLastName());
            }
            if (Objects.nonNull(requesterDTO.getPhoneNumber())) {
                requester.setPhoneNumber(requesterDTO.getPhoneNumber());
            }

            requester = requesterRepository.save(requester);
            return requesterMapper.toDTO(requester);
        }
    }

    @Override
    public RequesterDTO findRequesterById(Long id) {
        Optional<Requester> existingRequester = requesterRepository.findById(id);
        if (existingRequester.isEmpty()) {
            throw new NoSuchElementException("Requester with id: " + id + " not found");
        } else {
            return requesterMapper.toDTO(existingRequester);
        }
    }

    @Override
    public List<RequesterDTO> requesterList() {
        List<Requester> requesters = requesterRepository.findAll();
        return requesterMapper.toDTO(requesters);
    }
}
