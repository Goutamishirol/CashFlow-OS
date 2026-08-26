package com.example.demo.service;

import com.example.demo.model.Business;
import com.example.demo.model.User;
import com.example.demo.repository.BusinessRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class BusinessOwnershipService {
    private final BusinessRepository businessRepository;

    public BusinessOwnershipService(BusinessRepository businessRepository) {
        this.businessRepository = businessRepository;
    }

    public Business requireOwnedBusiness(Long businessId, Authentication authentication) {
        if (authentication == null || !(authentication.getPrincipal() instanceof User user)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        }
        Business business = businessRepository.findById(businessId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Business not found"));
        if (business.getOwner() == null || !business.getOwner().getId().equals(user.getId())) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Business not found");
        }
        return business;
    }
}
