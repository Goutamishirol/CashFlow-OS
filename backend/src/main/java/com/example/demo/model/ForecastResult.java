package com.example.demo.model;

import lombok.Data;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
@AllArgsConstructor
public class ForecastResult {
    private List<DailyBalance> dailyBalances;
    private boolean shortageDetected;
    private LocalDate shortageDate;
    private BigDecimal shortageAmount;

    @Data
    @AllArgsConstructor
    public static class DailyBalance {
        private LocalDate date;
        private BigDecimal projectedBalance;
    }
}