package com.example.backend.service.interfaces;

import com.example.backend.dto.EmailDetailsDTO;

public interface IEmailService {

    String sendSimpleEmail(EmailDetailsDTO emailDetailsDTO, String sender);
}
