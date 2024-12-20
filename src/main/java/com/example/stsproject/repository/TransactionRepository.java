package com.example.stsproject.repository;

import com.example.stsproject.entity.Transactions;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TransactionRepository extends JpaRepository<Transactions, Long> {
    List<Transactions> findByUserId(String userId); // 특정 사용자의 트랜잭션 조회
}