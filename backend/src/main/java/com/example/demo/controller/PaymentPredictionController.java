package com.example.demo.controller;

import com.example.demo.model.PaymentPrediction;
import com.example.demo.service.PaymentPredictionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.example.demo.service.BusinessOwnershipService;
import org.springframework.security.core.Authentication;

import java.util.List;

@RestController
@RequestMapping("/api/payment-prediction")
public class PaymentPredictionController {

    @Autowired
    private PaymentPredictionService paymentPredictionService;

    @Autowired
    private BusinessOwnershipService ownershipService;

    @GetMapping("/{businessId}")
    public List<PaymentPrediction> predictPaymentDelays(
            @PathVariable Long businessId, Authentication authentication) {
        ownershipService.requireOwnedBusiness(businessId, authentication);

        return paymentPredictionService.predictPaymentDelays(businessId);
    }
}