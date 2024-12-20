package com.example.stsproject.service;

import com.example.stsproject.entity.history;
import com.example.stsproject.repository.HistoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

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

    public history updateHistory(int nums, history updatedHistory) {
        Optional<history> existingHistory = historyRepository.findById(nums);
        if (existingHistory.isPresent()) {
            history history = existingHistory.get();
            history.setDivision(updatedHistory.getDivision());
            history.setAmount(updatedHistory.getAmount());
            history.setDetail(updatedHistory.getDetail());
            history.setDates(updatedHistory.getDates());
            return historyRepository.save(history);
        } else {
            throw new RuntimeException("History not found with ID " + nums);
        }
    }

    public void deleteHistory(int nums) {
        if (historyRepository.existsById(nums)) {
            historyRepository.deleteById(nums);
        } else {
            throw new RuntimeException("History not found with ID " + nums);
        }
    }
}