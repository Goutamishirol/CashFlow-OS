package com.example.demo.model;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class ScenarioResult {

    private BigDecimal currentBalance;

    private BigDecimal projectedBalanceBefore;

    private BigDecimal projectedBalanceAfter;

    private BigDecimal balanceDifference;

    private boolean shortageDetectedBefore;

    private boolean shortageDetectedAfter;

    private String message;
}