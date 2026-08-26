package com.example.demo.service;

import com.example.demo.model.Transaction;
import com.example.demo.model.TransactionType;
import com.example.demo.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.List;

@Service
public class CsvImportService {

    @Autowired
    private TransactionRepository transactionRepository;

    public int importTransactions(MultipartFile file, Long businessId) throws IOException {

        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("CSV file is empty");
        }

        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null || !originalFilename.toLowerCase().endsWith(".csv")) {
            throw new IllegalArgumentException("Only CSV files are allowed");
        }

        List<Transaction> transactions = new ArrayList<>();

        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8))) {

            String line;
            boolean firstLine = true;

            while ((line = reader.readLine()) != null) {

                if (line.trim().isEmpty()) {
                    continue;
                }

                // Skip CSV header
                if (firstLine) {
                    firstLine = false;
                    continue;
                }

                // Basic split: handles simple comma separation
                String[] columns = line.split(",", -1);

                if (columns.length != 4) {
                    throw new IllegalArgumentException(
                            "Invalid CSV row. Expected: date,amount,type,description"
                    );
                }

                LocalDate date;
                BigDecimal amount;
                TransactionType type;

                try {
                    date = LocalDate.parse(columns[0].trim());
                } catch (DateTimeParseException e) {
                    throw new IllegalArgumentException("Invalid date in CSV row: " + line, e);
                }

                try {
                    amount = new BigDecimal(columns[1].trim());
                } catch (NumberFormatException e) {
                    throw new IllegalArgumentException("Invalid amount in CSV row: " + line, e);
                }

                try {
                    type = TransactionType.valueOf(columns[2].trim().toUpperCase());
                } catch (IllegalArgumentException e) {
                    throw new IllegalArgumentException("Invalid transaction type in CSV row: " + line, e);
                }

                if (amount.compareTo(BigDecimal.ZERO) < 0) {
                    throw new IllegalArgumentException(
                            "Transaction amount cannot be negative: " + line
                    );
                }

                Transaction transaction = new Transaction();
                transaction.setBusinessId(businessId);
                transaction.setDate(date);
                transaction.setAmount(amount);
                transaction.setType(type);
                transaction.setDescription(columns[3].trim());

                transactions.add(transaction);
            }
        }

        if (!transactions.isEmpty()) {
            transactionRepository.saveAll(transactions);
        }

        return transactions.size();
    }
}