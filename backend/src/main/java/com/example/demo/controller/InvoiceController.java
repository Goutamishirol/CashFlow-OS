package com.example.demo.controller;

import com.example.demo.model.Invoice;
import com.example.demo.model.InvoiceStatus;
import com.example.demo.repository.InvoiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.example.demo.service.BusinessOwnershipService;
import org.springframework.security.core.Authentication;

import java.util.List;

@RestController
@RequestMapping("/api/invoices")
public class InvoiceController {

    @Autowired
    private InvoiceRepository invoiceRepository;

    @Autowired
    private BusinessOwnershipService ownershipService;

    @PostMapping
    public Invoice createInvoice(@RequestBody Invoice invoice, Authentication authentication) {
        ownershipService.requireOwnedBusiness(invoice.getBusinessId(), authentication);
        invoice.setId(null);
        return invoiceRepository.save(invoice);
    }

    @GetMapping("/{businessId}")
    public List<Invoice> getInvoicesForBusiness(@PathVariable Long businessId, Authentication authentication) {
        ownershipService.requireOwnedBusiness(businessId, authentication);
        return invoiceRepository.findByBusinessId(businessId);
    }

    @GetMapping("/overdue/{businessId}")
    public List<Invoice> getOverdueInvoices(@PathVariable Long businessId, Authentication authentication) {
        ownershipService.requireOwnedBusiness(businessId, authentication);
        return invoiceRepository.findByBusinessIdAndStatus(businessId, InvoiceStatus.OVERDUE);
    }
}