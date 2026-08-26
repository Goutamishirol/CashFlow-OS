package com.example.demo.controller;

import com.example.demo.service.AIService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
public class AIController {

    private final AIService aiService;

    public AIController(AIService aiService) {
        this.aiService = aiService;
    }

    @GetMapping("/test")
    public String testAI() {

        return aiService.generateInsight(
                "You are an AI assistant for CashFlow OS, " +
                        "a financial platform for small businesses. " +
                        "Explain in one short sentence why monitoring cash flow is important."
        );
    }
}