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
        histories.forEach(System.out::println);
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            String json = objectMapper.writeValueAsString(histories);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return ResponseEntity.ok(histories);
    }
}