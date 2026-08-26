package com.example.demo.controller;

import com.example.demo.model.CollectionMessageRequest;
import com.example.demo.service.CollectionMessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/collection-message")
public class CollectionMessageController {

    private static final Logger logger = LoggerFactory.getLogger(CollectionMessageController.class);

    @Autowired
    private CollectionMessageService collectionMessageService;

    @PostMapping
    public ResponseEntity<String> generateMessage(
            @RequestBody CollectionMessageRequest request) {

        try {
            return ResponseEntity.ok(collectionMessageService.generateCollectionMessage(request));
        } catch (RuntimeException exception) {
            logger.error("Failed to generate collection message", exception);
            return ResponseEntity.status(HttpStatus.BAD_GATEWAY)
                    .body("The AI reminder service is unavailable. Check GOOGLE_API_KEY and try again.");
        }
    }
}