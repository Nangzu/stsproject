package com.example.stsproject.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.stsproject.entity.Transactions;
import org.springframework.stereotype.Repository;

public interface TransactionRepository extends JpaRepository<Transactions, Long> {

}