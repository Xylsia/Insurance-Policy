package com.example.backend.controller;

import com.example.backend.dto.EmailDetailsDTO;
import com.example.backend.service.implementations.EmailServiceImpl;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@CrossOrigin
@RestController
@RequestMapping("/email")
public class EmailController {

    private final EmailServiceImpl emailService;
    @Value("${spring.mail.username}")
    private String sender;

    @Operation(summary = "Send a simple email", security = @SecurityRequirement(name = "Bearer Authentication"))
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/send")
    public ResponseEntity<String> sendSimpleEmail(@RequestBody EmailDetailsDTO emailDetailsDTO) {
        emailService.sendSimpleEmail(emailDetailsDTO, sender);
        return ResponseEntity.ok("Mail sent successfully");
    }
}
