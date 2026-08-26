package com.example.demo.model;

import lombok.Data;

@Data
public class FinancialHealthScore {

    private int score;

    private String status;

    private boolean borrowingSafe;

    private String explanation;
}