package com.example.demo.model;

import lombok.Data;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;

@Data
@AllArgsConstructor
public class CustomerRiskScore {
    private String customerName;
    private int totalInvoices;
    private int overdueInvoices;
    private double overdueRate;        // % of invoices that were/are overdue
    private BigDecimal totalOutstanding; // sum of unpaid invoice amounts
    private String riskLevel;           // LOW, MEDIUM, HIGH
}