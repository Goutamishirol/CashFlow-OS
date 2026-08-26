package com.example.demo.service;

import com.example.demo.model.Business;
import com.example.demo.model.CustomerRiskScore;
import com.example.demo.model.FinancialHealthScore;
import com.example.demo.model.ForecastResult;
import com.example.demo.repository.BusinessRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class FinancialHealthService {

    @Autowired
    private BusinessRepository businessRepository;

    @Autowired
    private ForecastService forecastService;

    @Autowired
    private RiskService riskService;

    public FinancialHealthScore calculateHealth(Long businessId) {

        Business business = businessRepository.findById(businessId)
                .orElseThrow(() ->
                        new RuntimeException("Business not found"));

        ForecastResult forecast =
                forecastService.generateForecast(businessId, 30);

        List<CustomerRiskScore> riskScores =
                riskService.getRiskScores(businessId);

        int score = 100;

        // 1. Cash balance vs monthly expenses
        BigDecimal balance = business.getCurrentBalance();
        BigDecimal expenses = business.getMonthlyExpenses();

        if (expenses.compareTo(BigDecimal.ZERO) > 0) {

            BigDecimal ratio = balance
                    .divide(expenses, 2, java.math.RoundingMode.HALF_UP);

            if (ratio.compareTo(new BigDecimal("0.25")) < 0) {
                score -= 30;
            } else if (ratio.compareTo(new BigDecimal("0.50")) < 0) {
                score -= 15;
            }
        }

        // 2. Projected cash shortage
        if (forecast.isShortageDetected()) {
            score -= 30;
        }

        // 3. Customer risk
        long highRiskCustomers = riskScores.stream()
                .filter(risk ->
                        "HIGH".equalsIgnoreCase(risk.getRiskLevel()))
                .count();

        if (highRiskCustomers >= 2) {
            score -= 20;
        } else if (highRiskCustomers == 1) {
            score -= 10;
        }

        // Keep score between 0 and 100
        score = Math.max(0, Math.min(100, score));

        String status;
        if (score >= 80) {
            status = "HEALTHY";
        } else if (score >= 60) {
            status = "MODERATE";
        } else {
            status = "AT_RISK";
        }

        boolean borrowingSafe =
                score >= 60 && !forecast.isShortageDetected();

        String explanation;

        if (score >= 80) {
            explanation =
                    "The business has a healthy cash position and no major projected cash-flow risk.";
        } else if (score >= 60) {
            explanation =
                    "The business is reasonably stable, but some financial risks should be monitored.";
        } else {
            explanation =
                    "The business has significant cash-flow risks and should improve liquidity before taking on new debt.";
        }

        FinancialHealthScore result = new FinancialHealthScore();

        result.setScore(score);
        result.setStatus(status);
        result.setBorrowingSafe(borrowingSafe);
        result.setExplanation(explanation);

        return result;
    }
}