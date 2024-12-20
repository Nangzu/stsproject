package com.example.stsproject.service;

import com.example.stsproject.entity.Transactions;
import com.example.stsproject.entity.Users;
import com.example.stsproject.repository.TransactionRepository;
import com.example.stsproject.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;

    public TransactionService(TransactionRepository transactionRepository, UserRepository userRepository) {
        this.transactionRepository = transactionRepository;
        this.userRepository = userRepository;
    }

    // CREATE
    public Transactions saveTransaction(Transactions transaction, String userId) {
        Users user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));

        transaction.setUser(user);
        return transactionRepository.save(transaction);
    }

    // READ (사용자의 모든 트랜잭션 조회)
    public List<Transactions> getAllTransactionsByUserId(String userId) {
        return transactionRepository.findByUserId(userId);
    }

    // READ (단일 트랜잭션 조회)
    public Transactions getTransactionById(Long transactionId) {
        return transactionRepository.findById(transactionId).orElse(null);
    }

    public List<Transactions> getTransactionsByDateAndUser(String userId, String udate) {
        return transactionRepository.findByUserIdAndUdate(userId, udate);
    }

    // UPDATE
    public boolean updateTransaction(Long transactionId, Transactions updatedTransaction, String userId) {
        Transactions existingTransaction = transactionRepository.findById(transactionId).orElse(null);
        if (existingTransaction == null || !existingTransaction.getUser().getId().equals(userId)) {
            return false;
        }

        // 업데이트 로직
        if (updatedTransaction.getType() != null) {
            existingTransaction.setType(updatedTransaction.getType());
        }
        if (updatedTransaction.getAmount() != null) {
            existingTransaction.setAmount(updatedTransaction.getAmount());
        }
        if (updatedTransaction.getCategory() != null) {
            existingTransaction.setCategory(updatedTransaction.getCategory());
        }
        if (updatedTransaction.getDescription() != null) {
            existingTransaction.setDescription(updatedTransaction.getDescription());
        }
        if (updatedTransaction.getUDate() != null) {
            existingTransaction.setUDate(updatedTransaction.getUDate());
        }


        existingTransaction.setDate(LocalDateTime.now());
        transactionRepository.save(existingTransaction);
        return true;
    }

    // DELETE
    public boolean deleteTransaction(Long transactionId, String userId) {
        Transactions transaction = transactionRepository.findById(transactionId).orElse(null);
        if (transaction == null || !transaction.getUser().getId().equals(userId)) {
            return false;
        }
        transactionRepository.deleteById(transactionId);
        return true;
    }
}