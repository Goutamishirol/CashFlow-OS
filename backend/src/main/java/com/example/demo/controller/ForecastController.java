package com.example.demo.controller;

import com.example.demo.model.ForecastResult;
import com.example.demo.service.ForecastService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.example.demo.service.BusinessOwnershipService;
import org.springframework.security.core.Authentication;

@RestController
@RequestMapping("/api/forecast")
public class ForecastController {

    @Autowired
    private ForecastService forecastService;

    @Autowired
    private BusinessOwnershipService ownershipService;

    @GetMapping("/{businessId}")
    public ForecastResult getForecast(@PathVariable Long businessId,
                                      @RequestParam(defaultValue = "30") int days,
                                      Authentication authentication) {
        ownershipService.requireOwnedBusiness(businessId, authentication);
        return forecastService.generateForecast(businessId, days);
    }
}