package com.example.backend.service.implementations;

import com.example.backend.dto.EmailDetailsDTO;
import com.example.backend.service.interfaces.IEmailService;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import org.springframework.mail.MailSendException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class EmailServiceImpl implements IEmailService {

    private final JavaMailSender mailSender;

    @Override
    public String sendSimpleEmail(EmailDetailsDTO emailDetailsDTO, String sender) {

        if (StringUtils.isBlank(sender)) {
            throw new IllegalArgumentException("Sender cannot be empty");
        }
        if (StringUtils.isBlank(emailDetailsDTO.getRecipient()) ||
                StringUtils.isBlank(emailDetailsDTO.getSubject()) ||
                StringUtils.isBlank(emailDetailsDTO.getMsgBody())) {
            throw new IllegalArgumentException("Email cannot be empty");
        }
        try {
            SimpleMailMessage mailMessage = new SimpleMailMessage();
            mailMessage.setFrom(sender);
            mailMessage.setTo(emailDetailsDTO.getRecipient());
            mailMessage.setText(emailDetailsDTO.getMsgBody());
            mailMessage.setSubject(emailDetailsDTO.getSubject());

            mailSender.send(mailMessage);
            return "Mail Sent Successfully";
        } catch (MailSendException e) {
            return "Error while sending mail " + e.getMessage();
        }
    }
}
