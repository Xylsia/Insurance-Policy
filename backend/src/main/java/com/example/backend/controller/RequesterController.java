package com.example.backend.controller;

import com.example.backend.dto.RequesterDTO;
import com.example.backend.service.implementations.RequesterServiceImpl;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@CrossOrigin
@RestController
@RequestMapping("/requester")
public class RequesterController {

    private final RequesterServiceImpl requesterService;

    @PreAuthorize("hasAnyRole('SALES_AGENT', 'ADMIN')")
    @PostMapping("/create")
    public ResponseEntity<RequesterDTO> createRequester(@Valid @RequestBody RequesterDTO requesterDTO) {
        return new ResponseEntity<>(requesterService.createRequester(requesterDTO), HttpStatus.CREATED);
    }

    @PreAuthorize("hasAnyRole('SALES_AGENT', 'ADMIN')")
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteRequester(@PathVariable("id") Long id) {
        requesterService.deleteRequester(id);
        return ResponseEntity.ok("Requester with id " + id + " has been deleted");
    }

    @PreAuthorize("hasAnyRole('SALES_AGENT', 'ADMIN')")
    @PatchMapping("/update")
    public ResponseEntity<RequesterDTO> updateRequester(@RequestBody RequesterDTO requesterDTO) {
        return new ResponseEntity<>(requesterService.updateRequester(requesterDTO), HttpStatus.OK);
    }

    @PreAuthorize("hasAnyRole('SALES_AGENT', 'ADMIN')")
    @GetMapping("/id/{id}")
    public ResponseEntity<RequesterDTO> findRequesterById(@PathVariable("id") Long id) {
        return new ResponseEntity<>(requesterService.findRequesterById(id), HttpStatus.OK);
    }

    @PreAuthorize("hasAnyRole('SALES_AGENT', 'ADMIN')")
    @GetMapping("/list")
    public ResponseEntity<List<RequesterDTO>> requesterList() {
        List<RequesterDTO> requesterDTOs = requesterService.requesterList();
        return new ResponseEntity<>(requesterDTOs, HttpStatus.OK);
    }
}
