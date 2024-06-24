package com.example.backend.service.interfaces;

import com.example.backend.model.InsurancePolicy;

import java.io.IOException;
import java.util.List;

public interface IReportService {

    byte[] generateReport(List<Long> policyIds) throws IOException;

    byte[] populateReport(List<InsurancePolicy> insurancePolicies) throws IOException;
}
