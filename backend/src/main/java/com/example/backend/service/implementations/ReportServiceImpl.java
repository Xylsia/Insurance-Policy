package com.example.backend.service.implementations;

import com.example.backend.mapper.IInsurancePolicyMapper;
import com.example.backend.model.InsurancePolicy;
import com.example.backend.service.interfaces.IReportService;
import lombok.RequiredArgsConstructor;
import net.sf.jasperreports.engine.*;
import net.sf.jasperreports.engine.data.JRBeanArrayDataSource;
import net.sf.jasperreports.engine.data.JRBeanCollectionDataSource;
import net.sf.jasperreports.engine.export.JRXlsExporter;
import net.sf.jasperreports.export.SimpleExporterInput;
import net.sf.jasperreports.export.SimpleOutputStreamExporterOutput;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Objects;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class ReportServiceImpl implements IReportService {

    private final InsurancePolicyServiceImpl insurancePolicyService;
    private final IInsurancePolicyMapper insurancePolicyMapper;

    @Override
    public byte[] generateReport(List<Long> policyIds) throws JRException, IOException {
        if (policyIds == null || policyIds.isEmpty()) {
            throw new NoSuchElementException("Insurance Policy IDs cannot be null nor empty");
        }

        List<InsurancePolicy> insurancePolicies = policyIds.stream()
                .map(insurancePolicyService::findInsurancePolicyById)
                .filter(Objects::nonNull)
                .map(insurancePolicyMapper::toModel)
                .collect(Collectors.toList());

        return generateJasperExcelReport(insurancePolicies);
    }

    @Override
    public byte[] generateJasperExcelReport(List<InsurancePolicy> insurancePolicies)
            throws JRException, IOException {
        try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
            JasperReport jasperReport = JasperCompileManager.compileReport(
                    getClass().getResourceAsStream("/report" + ".jrxml"));

            JRBeanCollectionDataSource dataSource =
                    new JRBeanCollectionDataSource(insurancePolicies);
            JasperPrint jasperPrint = JasperFillManager.fillReport(jasperReport, null, dataSource);

            JRXlsExporter exporter = new JRXlsExporter();
            exporter.setExporterInput(new SimpleExporterInput(jasperPrint));
            exporter.setExporterOutput(new SimpleOutputStreamExporterOutput(outputStream));
            exporter.exportReport();

            return outputStream.toByteArray();
        }
    }
}
