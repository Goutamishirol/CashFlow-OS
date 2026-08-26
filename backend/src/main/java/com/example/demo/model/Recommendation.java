package com.example.demo.model;

import lombok.Data;
import lombok.AllArgsConstructor;
import java.util.List;

@Data
@AllArgsConstructor
public class Recommendation {
    private String action;          // COLLECT, DELAY_EXPENSE, USE_SAVINGS, SEEK_FINANCING, NONE
    private String message;         // plain-English explanation
    private List<String> priorityCustomers; // customers to chase first, if any
}