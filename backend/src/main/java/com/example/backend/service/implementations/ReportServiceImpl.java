package com.example.backend.service.implementations;

import com.example.backend.mapper.IInsurancePolicyMapper;
import com.example.backend.model.CoverageType;
import com.example.backend.model.InsurancePolicy;
import com.example.backend.service.interfaces.IReportService;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class ReportServiceImpl implements IReportService {

    private final InsurancePolicyServiceImpl insurancePolicyService;
    private final IInsurancePolicyMapper insurancePolicyMapper;

    @Override
    public byte[] generateReport(List<Long> policyIds) throws IOException {
        if (policyIds == null || policyIds.isEmpty()) {
            throw new NoSuchElementException("Insurance Policy IDs cannot be null nor empty");
        }

        List<InsurancePolicy> insurancePolicies = policyIds.stream()
                .map(insurancePolicyService::findInsurancePolicyById)
                .filter(Objects::nonNull)
                .map(insurancePolicyMapper::toModel)
                .collect(Collectors.toList());

        return populateReport(insurancePolicies);
    }

    @Override
    public byte[] populateReport(List<InsurancePolicy> insurancePolicies) throws IOException {
        try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
            Workbook workbook = new XSSFWorkbook();

            Sheet sheet = workbook.createSheet("Insurance Policies");
            Row headerRow = sheet.createRow(0);
            headerRow.createCell(0).setCellValue("ID");
            headerRow.createCell(1).setCellValue("Date Created");
            headerRow.createCell(2).setCellValue("Agent");
            headerRow.createCell(3).setCellValue("Requester");
            headerRow.createCell(4).setCellValue("Insurance Item");
            headerRow.createCell(5).setCellValue("Coverages");
            headerRow.createCell(6).setCellValue("Estimated Price");
            headerRow.createCell(7).setCellValue("Loss Price Range Min");
            headerRow.createCell(8).setCellValue("Loss Price Range Max");

            int rowNum = 1;
            for (InsurancePolicy policy : insurancePolicies) {
                Row row = sheet.createRow(rowNum++);
                row.createCell(0).setCellValue(policy.getId());
                row.createCell(1).setCellValue(policy.getDateCreated().toString());
                row.createCell(2).setCellValue(policy.getAgent().getFirstName() + " " + policy.getAgent().getLastName());
                row.createCell(3).setCellValue(policy.getRequester().getFirstName() + " " + policy.getRequester().getLastName());
                row.createCell(4).setCellValue(policy.getInsuranceItem().toString());

                Set<String> coverages = policy.getCoverages().stream()
                        .map(CoverageType::toString)
                        .collect(Collectors.toSet());
                String coveragesString = String.join(", ", coverages);
                row.createCell(5).setCellValue(coveragesString);

                row.createCell(6).setCellValue(policy.getEstimatedPrice());
                row.createCell(7).setCellValue(policy.getLossPriceRangeMin());
                row.createCell(8).setCellValue(policy.getLossPriceRangeMax());
            }

            for (int i = 0; i < headerRow.getLastCellNum(); i++) {
                sheet.autoSizeColumn(i);
            }
            workbook.write(outputStream);
            workbook.close();

            return outputStream.toByteArray();
        }
    }
}
