package com.example.demo.service;

import com.example.demo.model.ForecastResult;
import com.example.demo.model.ScenarioRequest;
import com.example.demo.model.ScenarioResult;
import com.example.demo.model.Transaction;
import com.example.demo.model.TransactionType;
import com.example.demo.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class ScenarioService {

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private ForecastService forecastService;

    public ScenarioResult applyScenario(
            Long businessId,
            ScenarioRequest request) {

        if (request == null ||
                request.getType() == null ||
                request.getAmount() == null ||
                request.getDate() == null) {

            throw new IllegalArgumentException(
                    "Scenario type, amount and date are required"
            );
        }

        if (request.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException(
                    "Scenario amount must be greater than zero"
            );
        }

        // 1. Calculate forecast BEFORE applying scenario
        ForecastResult beforeForecast =
                forecastService.generateForecast(businessId, 30);

        BigDecimal projectedBefore =
                getFinalProjectedBalance(beforeForecast);

        boolean shortageBefore =
                beforeForecast.isShortageDetected();

        // 2. Create transaction
        Transaction transaction = new Transaction();

        transaction.setBusinessId(businessId);
        transaction.setDate(request.getDate());
        transaction.setAmount(request.getAmount());

        if ("CUSTOMER_PAYMENT".equalsIgnoreCase(request.getType())) {

            transaction.setType(TransactionType.INCOME);
            transaction.setDescription(
                    "Customer payment - scenario applied"
            );

        } else if ("EXPENSE".equalsIgnoreCase(request.getType())) {

            transaction.setType(TransactionType.EXPENSE);
            transaction.setDescription(
                    "Expense - scenario applied"
            );

        } else {

            throw new IllegalArgumentException(
                    "Invalid scenario type. Use CUSTOMER_PAYMENT or EXPENSE"
            );
        }

        // 3. Save to PostgreSQL
        transactionRepository.save(transaction);

        // 4. Calculate forecast AFTER applying scenario
        ForecastResult afterForecast =
                forecastService.generateForecast(businessId, 30);

        BigDecimal projectedAfter =
                getFinalProjectedBalance(afterForecast);

        boolean shortageAfter =
                afterForecast.isShortageDetected();

        // 5. Build result
        ScenarioResult result = new ScenarioResult();

        result.setCurrentBalance(projectedBefore);
        result.setProjectedBalanceBefore(projectedBefore);
        result.setProjectedBalanceAfter(projectedAfter);

        result.setBalanceDifference(
                projectedAfter.subtract(projectedBefore)
        );

        result.setShortageDetectedBefore(shortageBefore);
        result.setShortageDetectedAfter(shortageAfter);

        if ("CUSTOMER_PAYMENT".equalsIgnoreCase(request.getType())) {

            result.setMessage(
                    "Customer payment of ₹"
                            + request.getAmount()
                            + " was applied successfully. "
                            + "The transaction was saved to PostgreSQL."
            );

        } else {

            result.setMessage(
                    "Expense of ₹"
                            + request.getAmount()
                            + " was applied successfully. "
                            + "The transaction was saved to PostgreSQL."
            );
        }

        return result;
    }

    private BigDecimal getFinalProjectedBalance(
            ForecastResult forecast) {

        if (forecast.getDailyBalances() == null ||
                forecast.getDailyBalances().isEmpty()) {

            return BigDecimal.ZERO;
        }

        return forecast.getDailyBalances()
                .get(forecast.getDailyBalances().size() - 1)
                .getProjectedBalance();
    }
}