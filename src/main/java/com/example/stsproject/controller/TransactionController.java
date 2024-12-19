package com.example.stsproject.controller;

import com.example.stsproject.entity.Transactions;
import com.example.stsproject.service.TransactionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    private final TransactionService transactionService;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @PostMapping
    public ResponseEntity<String> createTransaction(@RequestBody Transactions transaction, @RequestParam String userId) {
        if (!transaction.getType().equalsIgnoreCase("income") && !transaction.getType().equalsIgnoreCase("expense")) {
            return ResponseEntity.badRequest().body("Invalid transaction type. Use 'income' or 'expense'.");
        }

        transactionService.saveTransaction(transaction, userId);
        return ResponseEntity.ok("Transaction created successfully");
    }
}