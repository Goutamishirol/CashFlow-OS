package com.example.demo.service;

import com.example.demo.model.*;
import com.example.demo.repository.BusinessRepository;
import com.example.demo.repository.InvoiceRepository;
import com.example.demo.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class ForecastService {

    @Autowired
    private BusinessRepository businessRepository;

    @Autowired
    private InvoiceRepository invoiceRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    public ForecastResult generateForecast(Long businessId, int days) {

        Business business = businessRepository.findById(businessId)
                .orElseThrow(() -> new RuntimeException("Business not found"));

        if (days <= 0) {
            throw new IllegalArgumentException("Forecast days must be greater than 0");
        }

        List<Invoice> invoices = invoiceRepository.findByBusinessId(businessId);
        List<Transaction> transactions = transactionRepository.findByBusinessId(businessId);

        /*
         * Calculate average daily expense from historical transactions.
         *
         * Only EXPENSE transactions are included.
         */
        BigDecimal totalExpenses = transactions.stream()
                .filter(t -> t.getType() == TransactionType.EXPENSE)
                .map(Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal dailyExpenseRate;

        if (transactions.isEmpty()) {
            dailyExpenseRate = BigDecimal.ZERO;
        } else {
            dailyExpenseRate = totalExpenses
                    .divide(BigDecimal.valueOf(30), 2, RoundingMode.HALF_UP);
        }

        BigDecimal runningBalance = business.getCurrentBalance();

        List<ForecastResult.DailyBalance> dailyBalances = new ArrayList<>();

        boolean shortageDetected = false;
        LocalDate shortageDate = null;
        BigDecimal shortageAmount = null;

        LocalDate today = LocalDate.now();

        for (int day = 1; day <= days; day++) {

            LocalDate currentDate = today.plusDays(day);

            // 1. Subtract expected daily expenses
            runningBalance = runningBalance.subtract(dailyExpenseRate);

            // 2. Add invoices expected to be collected on this date
            for (Invoice invoice : invoices) {

                if (invoice.getStatus() != InvoiceStatus.PAID
                        && invoice.getDueDate() != null
                        && invoice.getDueDate().equals(currentDate)) {

                    runningBalance = runningBalance.add(invoice.getAmount());
                }
            }

            // 3. Store projected balance
            dailyBalances.add(
                    new ForecastResult.DailyBalance(
                            currentDate,
                            runningBalance.setScale(2, RoundingMode.HALF_UP)
                    )
            );

            // 4. Detect first cash shortage
            if (!shortageDetected
                    && runningBalance.compareTo(BigDecimal.ZERO) < 0) {

                shortageDetected = true;
                shortageDate = currentDate;
                shortageAmount = runningBalance.abs()
                        .setScale(2, RoundingMode.HALF_UP);
            }
        }

        return new ForecastResult(
                dailyBalances,
                shortageDetected,
                shortageDate,
                shortageAmount
        );
    }
}