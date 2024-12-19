package com.example.stsproject.controller;

import com.example.stsproject.service.GoodsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class GoodsController {

    @Autowired
    private GoodsService goodsService;

    // 유저의 score를 기반으로 상품을 조회하여 리턴하는 엔드포인트
    @GetMapping("/goods/{userId}")
    public List<Map<String, Object>> getTop5GoodsForUser(@PathVariable String userId) {
        return goodsService.getTop5GoodsForUser(userId);
    }
}
