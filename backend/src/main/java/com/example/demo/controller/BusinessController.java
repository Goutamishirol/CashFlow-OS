package com.example.demo.controller;

import com.example.demo.model.Business;
import com.example.demo.repository.BusinessRepository;
import com.example.demo.service.BusinessOwnershipService;
import org.springframework.security.core.Authentication;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/business")
public class BusinessController {

    @Autowired
    private BusinessRepository businessRepository;

    @Autowired
    private BusinessOwnershipService ownershipService;

    @PostMapping
    public Business createBusiness(@RequestBody Business business, Authentication authentication) {
        business.setId(null);
        business.setOwner((com.example.demo.model.User) authentication.getPrincipal());
        return businessRepository.save(business);
    }

    @GetMapping("/{id}")
    public Business getBusiness(@PathVariable Long id, Authentication authentication) {
        return ownershipService.requireOwnedBusiness(id, authentication);
    }

    @GetMapping
    public List<Business> getAllBusinesses(Authentication authentication) {
        return businessRepository.findByOwner((com.example.demo.model.User) authentication.getPrincipal());
    }
}