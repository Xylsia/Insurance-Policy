package com.example.backend.service.interfaces;

import com.example.backend.model.InsurancePolicy;
import net.sf.jasperreports.engine.JRException;

import java.io.IOException;
import java.util.List;

public interface IReportService {

    byte[] generateReport(List<Long> policyIds) throws JRException, IOException;

    byte[] generateJasperExcelReport(List<InsurancePolicy> insurancePolicies)
            throws JRException, IOException;
}
