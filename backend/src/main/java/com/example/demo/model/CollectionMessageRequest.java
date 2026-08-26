package com.example.demo.model;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class CollectionMessageRequest {

    private String customerName;

    private BigDecimal amount;

    private String dueDate;
}