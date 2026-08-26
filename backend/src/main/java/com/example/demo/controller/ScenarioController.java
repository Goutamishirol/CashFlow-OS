package com.example.demo.controller;

import com.example.demo.model.ScenarioRequest;
import com.example.demo.model.ScenarioResult;
import com.example.demo.service.ScenarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.example.demo.service.BusinessOwnershipService;
import org.springframework.security.core.Authentication;

@RestController
@RequestMapping("/api/scenario")
public class ScenarioController {

    @Autowired
    private ScenarioService scenarioService;

    @Autowired
    private BusinessOwnershipService ownershipService;

    @PostMapping("/{businessId}")
    public ScenarioResult applyScenario(
            @PathVariable Long businessId,
            @RequestBody ScenarioRequest request,
            Authentication authentication) {

        ownershipService.requireOwnedBusiness(businessId, authentication);

        return scenarioService.applyScenario(
                businessId,
                request
        );
    }
}