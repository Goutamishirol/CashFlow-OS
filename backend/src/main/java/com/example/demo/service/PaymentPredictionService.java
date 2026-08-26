package com.example.demo.service;

import com.example.demo.model.Invoice;
import com.example.demo.model.PaymentPrediction;
import com.example.demo.repository.InvoiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class PaymentPredictionService {

    @Autowired
    private InvoiceRepository invoiceRepository;

    public List<PaymentPrediction> predictPaymentDelays(Long businessId) {

        List<Invoice> invoices =
                invoiceRepository.findByBusinessId(businessId);

        Map<String, List<Invoice>> customerInvoices =
                invoices.stream()
                        .collect(Collectors.groupingBy(
                                Invoice::getCustomerName
                        ));

        List<PaymentPrediction> predictions = new ArrayList<>();

        for (Map.Entry<String, List<Invoice>> entry :
                customerInvoices.entrySet()) {

            String customerName = entry.getKey();
            List<Invoice> customerList = entry.getValue();

            int totalInvoices = customerList.size();

            long overdueInvoices = customerList.stream()
                    .filter(invoice ->
                            invoice.getStatus() != null &&
                                    invoice.getStatus().name().equalsIgnoreCase("OVERDUE"))
                    .count();

            double overdueRate =
                    (double) overdueInvoices / totalInvoices;

            double latePaymentProbability =
                    overdueRate * 100;

            String riskLevel;
            int expectedDelayDays;
            String reason;

            if (overdueRate >= 0.75) {
                riskLevel = "HIGH";
                expectedDelayDays = 15;
                reason = "Customer has a high historical overdue rate.";
            } else if (overdueRate >= 0.40) {
                riskLevel = "MEDIUM";
                expectedDelayDays = 7;
                reason = "Customer has a moderate history of overdue invoices.";
            } else {
                riskLevel = "LOW";
                expectedDelayDays = 0;
                reason = "Customer has a low historical overdue rate.";
            }

            PaymentPrediction prediction = new PaymentPrediction();

            prediction.setCustomerName(customerName);
            prediction.setLatePaymentProbability(
                    latePaymentProbability);
            prediction.setExpectedDelayDays(expectedDelayDays);
            prediction.setRiskLevel(riskLevel);
            prediction.setReason(reason);

            predictions.add(prediction);
        }

        return predictions;
    }
}