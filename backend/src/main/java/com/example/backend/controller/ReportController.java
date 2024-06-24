package com.example.backend.controller;

import com.example.backend.service.implementations.ReportServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/report")
@CrossOrigin
@RequiredArgsConstructor
public class ReportController {

    private final ReportServiceImpl reportService;

    @PreAuthorize("hasAnyRole('SALES_AGENT', 'ADMIN')")
    @GetMapping("/generate-report")
    public ResponseEntity<byte[]> generateReport(
            @RequestParam(value = "policyIds") List<Long> policyIds) {
        byte[] excelFile;
        HttpHeaders headers = new HttpHeaders();

        if (policyIds == null || policyIds.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } else {
            try {
                excelFile = reportService.generateReport(policyIds);
                headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
                String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy" +
                        "-MM-dd-HH-mm-ss"));
                String fileName = "Policies_" + timestamp + ".xlsx";
                headers.add("Content-Disposition", "inline; filename=" + fileName);
                return ResponseEntity.ok().headers(headers).body(excelFile);
            } catch (IOException e) {
                return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
            } catch (NoSuchElementException e) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        }
    }
}
