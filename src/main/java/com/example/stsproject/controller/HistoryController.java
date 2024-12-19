package com.example.stsproject.controller;

import com.example.stsproject.entity.history;
import com.example.stsproject.service.HistoryService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/history")
public class HistoryController {

    @Autowired
    private HistoryService historyService;

    @PostMapping("/add")
    public ResponseEntity<history> addHistory(@RequestBody history history) {
        history savedHistory = historyService.saveHistory(history);
        return ResponseEntity.ok(savedHistory);
    }

    @GetMapping("/user/{id}")
    public ResponseEntity<List<history>> getHistoriesByUserId(@PathVariable String id) {
        List<history> histories = historyService.getHistoriesByUserId(id);
        System.out.println("Fetched histories for user ID: " + id);
        histories.forEach(System.out::println);
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            String json = objectMapper.writeValueAsString(histories);
            System.out.println("Serialized JSON: " + json);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return ResponseEntity.ok(histories);
    }

    @PutMapping("/update/{nums}")
    public ResponseEntity<history> updateHistory(@PathVariable int nums, @RequestBody history updatedHistory) {
        history history = historyService.updateHistory(nums, updatedHistory);
        return ResponseEntity.ok(history);
    }

    @DeleteMapping("/delete/{nums}")
    public ResponseEntity<String> deleteHistory(@PathVariable int nums) {
        historyService.deleteHistory(nums);
        return ResponseEntity.ok("History with ID " + nums + " has been deleted.");
    }


}