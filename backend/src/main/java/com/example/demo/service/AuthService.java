package com.example.demo.service;

import com.example.demo.model.Business;
import com.example.demo.model.User;
import com.example.demo.model.auth.SignupRequest;
import com.example.demo.repository.BusinessRepository;
import com.example.demo.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final BusinessRepository businessRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository, BusinessRepository businessRepository,
                       PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.businessRepository = businessRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public User signup(SignupRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        if (userRepository.existsByEmailIgnoreCase(email)) {
            throw new IllegalArgumentException("An account with that email already exists");
        }
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new IllegalArgumentException("Passwords do not match");
        }

        User user = new User();
        user.setFullName(request.getFullName().trim());
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        User savedUser = userRepository.save(user);

        boolean isFirstUser = userRepository.findTopByOrderByIdAsc()
                .map(firstUser -> firstUser.getId().equals(savedUser.getId()))
            .orElse(false);
        if (isFirstUser) {
            for (Business business : businessRepository.findByOwnerIsNull()) {
                business.setOwner(savedUser);
                businessRepository.save(business);
            }
        }

        if (businessRepository.findByOwner(savedUser).isEmpty()) {
            Business business = new Business();
            business.setOwner(savedUser);
            business.setName("My Business");
            business.setCurrentBalance(java.math.BigDecimal.ZERO);
            business.setMonthlyExpenses(java.math.BigDecimal.ZERO);
            businessRepository.save(business);
        }
        return savedUser;
    }
}
