package com.example.demo.controller;

import com.example.demo.model.Transaction;
import com.example.demo.repository.TransactionRepository;
import com.example.demo.service.CsvImportService;
import com.example.demo.service.BusinessOwnershipService;
import org.springframework.security.core.Authentication;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private CsvImportService csvImportService;

    @Autowired
    private BusinessOwnershipService ownershipService;

    @PostMapping
    public Transaction createTransaction(@RequestBody Transaction transaction, Authentication authentication) {
        ownershipService.requireOwnedBusiness(transaction.getBusinessId(), authentication);
        transaction.setId(null);
        return transactionRepository.save(transaction);
    }

    @GetMapping("/{businessId}")
    public List<Transaction> getTransactionsForBusiness(
            @PathVariable Long businessId, Authentication authentication) {
        ownershipService.requireOwnedBusiness(businessId, authentication);
        return transactionRepository.findByBusinessId(businessId);
    }

    @PostMapping("/upload")
    public String uploadTransactions(
            @RequestParam("file") MultipartFile file,
            @RequestParam Long businessId, Authentication authentication) throws IOException {
        ownershipService.requireOwnedBusiness(businessId, authentication);

        int imported = csvImportService.importTransactions(file, businessId);


        return imported + " transactions imported successfully";
    }
}