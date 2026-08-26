package com.example.demo.service;

import com.example.demo.model.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class RecommendationService {

    @Autowired
    private ForecastService forecastService;

    @Autowired
    private RiskService riskService;

    public Recommendation generateRecommendation(Long businessId) {

        ForecastResult forecast = forecastService.generateForecast(businessId, 30);
        List<CustomerRiskScore> riskScores = riskService.getRiskScores(businessId);

        // No shortage projected — business is safe for now
        if (!forecast.isShortageDetected()) {
            return new Recommendation(
                    "NONE",
                    "No cash shortage projected in the next 30 days. Cash flow looks healthy.",
                    Collections.emptyList()
            );
        }

        // Shortage detected - find highest-outstanding, non-low-risk customers to prioritize collecting from
        List<CustomerRiskScore> priorityTargets = riskScores.stream()
                .filter(r -> r.getTotalOutstanding().compareTo(BigDecimal.ZERO) > 0)
                .sorted((a, b) -> b.getTotalOutstanding().compareTo(a.getTotalOutstanding()))
                .limit(2)
                .collect(Collectors.toList());

        List<String> priorityNames = priorityTargets.stream()
                .map(CustomerRiskScore::getCustomerName)
                .collect(Collectors.toList());

        BigDecimal totalRecoverable = priorityTargets.stream()
                .map(CustomerRiskScore::getTotalOutstanding)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        String action;
        String message;

        if (!priorityTargets.isEmpty() && totalRecoverable.abs().compareTo(forecast.getShortageAmount().abs()) >= 0) {
            // Collecting from top customers alone can cover the shortage
            action = "COLLECT";
            message = String.format(
                    "High cash-flow risk on %s (projected shortfall of ₹%s). Follow up with %s first — collecting outstanding invoices from them should cover the gap.",
                    forecast.getShortageDate(),
                    forecast.getShortageAmount().abs(),
                    String.join(" and ", priorityNames)
            );
        } else if (!priorityTargets.isEmpty()) {
            action = "COLLECT_AND_DELAY";
            message = String.format(
                    "High cash-flow risk on %s (projected shortfall of ₹%s). Follow up with %s, and consider delaying non-critical expenses — collections alone may not fully cover the gap.",
                    forecast.getShortageDate(),
                    forecast.getShortageAmount().abs(),
                    String.join(" and ", priorityNames)
            );
        } else {
            action = "SEEK_FINANCING";
            message = String.format(
                    "High cash-flow risk on %s (projected shortfall of ₹%s), with no significant outstanding invoices to collect. Consider a short-term working-capital option.",
                    forecast.getShortageDate(),
                    forecast.getShortageAmount().abs()
            );
        }

        return new Recommendation(action, message, priorityNames);
    }
}