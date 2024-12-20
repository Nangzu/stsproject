package com.example.stsproject.service;

import com.example.stsproject.entity.Transactions;
import com.example.stsproject.entity.Users;
import com.example.stsproject.repository.TransactionRepository;
import com.example.stsproject.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;

    public TransactionService(TransactionRepository transactionRepository, UserRepository userRepository) {
        this.transactionRepository = transactionRepository;
        this.userRepository = userRepository;
    }

    public Transactions saveTransaction(Transactions transaction, String userId) {
        // Users 조회
        Users user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));

        // Transaction에 Users 설정
        transaction.setUser(user);
        transaction.setDescription(transaction.getDescription());
        transaction.setAmount(transaction.getAmount());
        transaction.setCategory(transaction.getCategory());

        // 저장
        return transactionRepository.save(transaction);
    }
}