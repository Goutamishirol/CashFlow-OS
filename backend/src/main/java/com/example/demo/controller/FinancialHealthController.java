package com.example.demo.controller;

import com.example.demo.model.FinancialHealthScore;
import com.example.demo.service.FinancialHealthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.example.demo.service.BusinessOwnershipService;
import org.springframework.security.core.Authentication;

@RestController
@RequestMapping("/api/financial-health")
public class FinancialHealthController {

    @Autowired
    private FinancialHealthService financialHealthService;

    @Autowired
    private BusinessOwnershipService ownershipService;

    @GetMapping("/{businessId}")
    public FinancialHealthScore getFinancialHealth(
            @PathVariable Long businessId, Authentication authentication) {
        ownershipService.requireOwnedBusiness(businessId, authentication);

        return financialHealthService.calculateHealth(businessId);
    }
}