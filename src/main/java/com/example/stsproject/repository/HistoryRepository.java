package com.example.stsproject.repository;

import com.example.stsproject.entity.history;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface HistoryRepository extends JpaRepository<history, Integer> {

    List<history> findById(String id);
}