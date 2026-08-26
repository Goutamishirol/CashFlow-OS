package com.example.demo.model;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class ScenarioRequest {

    private String type;

    private BigDecimal amount;

    private LocalDate date;
}