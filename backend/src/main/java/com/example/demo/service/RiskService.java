package com.example.demo.service;

import com.example.demo.model.*;
import com.example.demo.repository.InvoiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class RiskService {

    @Autowired
    private InvoiceRepository invoiceRepository;

    public List<CustomerRiskScore> getRiskScores(Long businessId) {

        List<Invoice> invoices = invoiceRepository.findByBusinessId(businessId);

        // Group invoices by customer name
        Map<String, List<Invoice>> byCustomer = invoices.stream()
                .collect(Collectors.groupingBy(Invoice::getCustomerName));

        List<CustomerRiskScore> scores = new ArrayList<>();

        for (Map.Entry<String, List<Invoice>> entry : byCustomer.entrySet()) {
            String customerName = entry.getKey();
            List<Invoice> customerInvoices = entry.getValue();

            int total = customerInvoices.size();
            int overdue = (int) customerInvoices.stream()
                    .filter(i -> i.getStatus() == InvoiceStatus.OVERDUE)
                    .count();

            double overdueRate = total == 0 ? 0.0 : (double) overdue / total;

            BigDecimal outstanding = customerInvoices.stream()
                    .filter(i -> i.getStatus() != InvoiceStatus.PAID)
                    .map(Invoice::getAmount)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            String riskLevel;
            if (overdueRate >= 0.5) {
                riskLevel = "HIGH";
            } else if (overdueRate >= 0.2) {
                riskLevel = "MEDIUM";
            } else {
                riskLevel = "LOW";
            }

            scores.add(new CustomerRiskScore(customerName, total, overdue, overdueRate, outstanding, riskLevel));
        }

        return scores;
    }
}