package com.example.stsproject.controller;

import com.example.stsproject.entity.Transactions;
import com.example.stsproject.service.TransactionService;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    private final TransactionService transactionService;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    // CREATE
    @PostMapping
    public ResponseEntity<String> createTransaction(
            @RequestBody Transactions transaction,
            HttpSession session) {
        String userId = (String) session.getAttribute("id");
        if (userId == null) {
            return ResponseEntity.status(401).body("User not logged in");
        }

        if (!transaction.getType().equalsIgnoreCase("수입") && !transaction.getType().equalsIgnoreCase("지출")) {
            return ResponseEntity.badRequest().body("Invalid transaction type. Use 'income' or 'expense'.");
        }

        transactionService.saveTransaction(transaction, userId);
        return ResponseEntity.ok("Transaction created successfully");
    }

    // READ (사용자의 모든 트랜잭션 조회)
    @GetMapping
    public ResponseEntity<List<Transactions>> getAllTransactions(HttpSession session) {
        String userId = (String) session.getAttribute("id");
        if (userId == null) {
            return ResponseEntity.status(401).body(null);
        }
        return ResponseEntity.ok(transactionService.getAllTransactionsByUserId(userId));
    }


    // READ (단일 트랜잭션 조회)
    @GetMapping("/{transactionId}")
    public ResponseEntity<Transactions> getTransactionById(
            @PathVariable Long transactionId, HttpSession session) {
        String userId = (String) session.getAttribute("id");
        if (userId == null) {
            return ResponseEntity.status(401).body(null);
        }

        Transactions transaction = transactionService.getTransactionById(transactionId);
        if (transaction == null || !transaction.getUser().getId().equals(userId)) {
            return ResponseEntity.status(403).build();
        }
        return ResponseEntity.ok(transaction);
    }

    @GetMapping("/date/{udate}")
    public ResponseEntity<List<Transactions>> getTransactionsByDate(
            @PathVariable String udate,
            HttpSession session) {
        String userId = (String) session.getAttribute("id");
        if (userId == null) {
            return ResponseEntity.status(401).body(null);
        }

        List<Transactions> transactions = transactionService.getTransactionsByDateAndUser(userId, udate);
        return ResponseEntity.ok(transactions);
    }

    // UPDATE
    @PutMapping("/{transactionId}")
    public ResponseEntity<String> updateTransaction(
            @PathVariable Long transactionId,
            @RequestBody Transactions updatedTransaction,
            HttpSession session) {
        String userId = (String) session.getAttribute("id");
        if (userId == null) {
            return ResponseEntity.status(401).body("User not logged in");
        }

        boolean isUpdated = transactionService.updateTransaction(transactionId, updatedTransaction, userId);
        if (!isUpdated) {
            return ResponseEntity.status(403).body("Transaction not found or access denied");
        }
        return ResponseEntity.ok("Transaction updated successfully");
    }

    // DELETE
    @DeleteMapping("/{transactionId}")
    public ResponseEntity<String> deleteTransaction(
            @PathVariable Long transactionId, HttpSession session) {
        String userId = (String) session.getAttribute("id");
        if (userId == null) {
            return ResponseEntity.status(401).body("User not logged in");
        }

        boolean isDeleted = transactionService.deleteTransaction(transactionId, userId);
        if (!isDeleted) {
            return ResponseEntity.status(403).body("Transaction not found or access denied");
        }
        return ResponseEntity.ok("Transaction deleted successfully");
    }
}