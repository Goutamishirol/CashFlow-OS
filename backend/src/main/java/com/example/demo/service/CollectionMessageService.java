package com.example.demo.service;

import com.example.demo.model.CollectionMessageRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CollectionMessageService {

    @Autowired
    private AIService aiService;

    public String generateCollectionMessage(CollectionMessageRequest request) {

        String prompt = """
                You are a professional payment collection assistant for CashFlow OS.

                Generate a polite and professional payment reminder for a business customer.

                Customer name: %s
                Outstanding amount: ₹%s
                Due date: %s

                Requirements:
                - Be polite and professional.
                - Clearly mention the outstanding amount.
                - Clearly mention the due date.
                - Do not threaten the customer.
                - Keep it short and suitable for WhatsApp.
                - Return only the message.
                """.formatted(
                request.getCustomerName(),
                request.getAmount(),
                request.getDueDate()
        );

        return aiService.generateInsight(prompt);
    }
}