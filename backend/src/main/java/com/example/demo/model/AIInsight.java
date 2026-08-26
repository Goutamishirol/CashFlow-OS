package com.example.demo.model;

import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class AIInsight {

    private String cashFlowStatus;

    private String riskLevel;

    private String summary;

    private String recommendedAction;

    private String shortageDate;

    private BigDecimal shortageAmount;

    private List<PriorityCustomer> priorityCustomers;

    @Data
    public static class PriorityCustomer {

        private String name;

        private String riskLevel;

        private BigDecimal outstanding;
    }
}