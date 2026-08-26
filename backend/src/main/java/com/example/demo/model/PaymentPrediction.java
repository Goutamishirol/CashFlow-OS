package com.example.demo.model;

import lombok.Data;

@Data
public class PaymentPrediction {

    private String customerName;

    private double latePaymentProbability;

    private int expectedDelayDays;

    private String riskLevel;

    private String reason;
}