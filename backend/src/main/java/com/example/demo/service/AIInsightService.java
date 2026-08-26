package com.example.demo.service;

import com.example.demo.model.AIInsight;
import com.example.demo.model.CustomerRiskScore;
import com.example.demo.model.ForecastResult;
import com.example.demo.model.Recommendation;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AIInsightService {

    @Autowired
    private ForecastService forecastService;

    @Autowired
    private RiskService riskService;

    @Autowired
    private RecommendationService recommendationService;

    @Autowired
    private AIService aiService;

    // Create ObjectMapper directly
    private final ObjectMapper objectMapper = new ObjectMapper();

    public AIInsight generateBusinessInsight(Long businessId) {

        ForecastResult forecast =
                forecastService.generateForecast(businessId, 30);

        List<CustomerRiskScore> riskScores =
                riskService.getRiskScores(businessId);

        Recommendation recommendation =
                recommendationService.generateRecommendation(businessId);

        StringBuilder prompt = new StringBuilder();

        prompt.append("""
                You are the financial intelligence assistant for CashFlow OS.

                Analyze the provided business financial data.

                IMPORTANT:
                - Use ONLY the supplied data.
                - Do not invent numbers.
                - Do not change any financial values.
                - Return ONLY valid JSON.
                - Do not use markdown.
                - Do not add ```json or ```.

                Return exactly this structure:

                {
                  "cashFlowStatus": "HEALTHY or AT_RISK",
                  "riskLevel": "LOW, MEDIUM, or HIGH",
                  "summary": "short explanation",
                  "recommendedAction": "short recommended action",
                  "shortageDate": "YYYY-MM-DD or null",
                  "shortageAmount": number or null,
                  "priorityCustomers": [
                    {
                      "name": "customer name",
                      "riskLevel": "LOW, MEDIUM, or HIGH",
                      "outstanding": number
                    }
                  ]
                }

                Financial data:
                """);

        prompt.append("\nForecast:\n");

        prompt.append("Shortage detected: ")
                .append(forecast.isShortageDetected())
                .append("\n");

        prompt.append("Shortage date: ")
                .append(forecast.getShortageDate())
                .append("\n");

        prompt.append("Shortage amount: ")
                .append(forecast.getShortageAmount())
                .append("\n");

        prompt.append("\nRecommendation:\n");

        prompt.append("Action: ")
                .append(recommendation.getAction())
                .append("\n");

        prompt.append("Message: ")
                .append(recommendation.getMessage())
                .append("\n");

        prompt.append("\nCustomer risk scores:\n");

        for (CustomerRiskScore score : riskScores) {

            prompt.append("- Customer: ")
                    .append(score.getCustomerName())
                    .append(", total invoices: ")
                    .append(score.getTotalInvoices())
                    .append(", overdue invoices: ")
                    .append(score.getOverdueInvoices())
                    .append(", overdue rate: ")
                    .append(score.getOverdueRate())
                    .append(", outstanding: ")
                    .append(score.getTotalOutstanding())
                    .append(", risk level: ")
                    .append(score.getRiskLevel())
                    .append("\n");
        }

        String aiResponse =
                aiService.generateInsight(prompt.toString());

        try {
            return objectMapper.readValue(aiResponse, AIInsight.class);

        } catch (Exception e) {

            throw new RuntimeException(
                    "Gemini returned invalid JSON: " + aiResponse,
                    e
            );
        }
    }
}