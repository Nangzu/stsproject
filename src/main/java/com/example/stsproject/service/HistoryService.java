package com.example.stsproject.service;

import com.example.stsproject.entity.history;
import com.example.stsproject.repository.HistoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class HistoryService {

    @Autowired
    private HistoryRepository historyRepository;

    public history saveHistory(history history) {
        return historyRepository.save(history);
    }


    public List<history> getAllHistories() {
        return historyRepository.findAll();
    }


    public List<history> getHistoriesByUserId(String id) {
        return historyRepository.findById(id);
    }
}