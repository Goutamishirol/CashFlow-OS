package com.example.demo.service;

import com.google.genai.Client;
import com.google.genai.types.GenerateContentResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class AIService {

    private final Client client;

    public AIService(@Value("${google.api.key:}") String apiKey) {
        this.client = apiKey.isBlank() ? null : Client.builder().apiKey(apiKey).build();
    }

    public String generateInsight(String prompt) {
        if (client == null) {
            throw new IllegalStateException(
                    "GOOGLE_API_KEY is not configured. Set it and restart the backend.");
        }

        GenerateContentResponse response =
                client.models.generateContent(
                "gemini-3.6-flash",
                        prompt,
                        null
                );

        return response.text();
    }
}