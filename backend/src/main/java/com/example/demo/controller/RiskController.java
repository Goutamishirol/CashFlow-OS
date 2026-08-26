package com.example.demo.controller;

import com.example.demo.model.CustomerRiskScore;
import com.example.demo.service.RiskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.example.demo.service.BusinessOwnershipService;
import org.springframework.security.core.Authentication;

import java.util.List;

@RestController
@RequestMapping("/api/risk")
public class RiskController {

    @Autowired
    private RiskService riskService;

    @Autowired
    private BusinessOwnershipService ownershipService;

    @GetMapping("/{businessId}")
    public List<CustomerRiskScore> getRisk(@PathVariable Long businessId, Authentication authentication) {
        ownershipService.requireOwnedBusiness(businessId, authentication);
        return riskService.getRiskScores(businessId);
    }
}