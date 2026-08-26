package com.example.demo.controller;

import com.example.demo.model.AIInsight;
import com.example.demo.service.AIInsightService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.example.demo.service.BusinessOwnershipService;
import org.springframework.security.core.Authentication;

@RestController
@RequestMapping("/api/ai")
public class AIInsightController {

    @Autowired
    private AIInsightService aiInsightService;

    @Autowired
    private BusinessOwnershipService ownershipService;

    @GetMapping("/insight/{businessId}")
    public AIInsight getBusinessInsight(
            @PathVariable Long businessId, Authentication authentication) {
        ownershipService.requireOwnedBusiness(businessId, authentication);

        return aiInsightService.generateBusinessInsight(businessId);
    }
}