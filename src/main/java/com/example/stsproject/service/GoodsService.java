package com.example.stsproject.service;

import com.example.stsproject.entity.goods;
import com.example.stsproject.entity.Users;
import com.example.stsproject.repository.GoodsRepository;
import com.example.stsproject.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class GoodsService {

    @Autowired
    private GoodsRepository goodsRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Map<String, Object>> getTop5GoodsForUser(String userId) {
        // 1. 유저의 score를 가져옴
        Optional<Users> userOptional = userRepository.findById(userId);
        if (userOptional.isEmpty()) {
            throw new IllegalArgumentException("User not found");
        }
        BigDecimal userScore = userOptional.get().getScore();  // 유저의 score

        // 2. score가 유저의 score보다 작은 상품들 조회
        List<goods> allGoods = goodsRepository.findAllByScoreLessThan(userScore); // score가 userScore보다 작은 상품들

        // 3. 각 카테고리 별로 필터링
        List<String> categories = Arrays.asList("정기예금", "개인신용대출", "적금금리", "전세자금대출", "주택담보대출");
        List<Map<String, Object>> result = new ArrayList<>();

        for (String category : categories) {
            // 해당 카테고리에 맞는 상품만 필터링
            List<goods> filteredGoods = allGoods.stream()
                    .filter(good -> good.getDetail().contains(category))
                    .sorted(Comparator.comparing(goods::getMrate).reversed()) // mrate 기준 내림차순 정렬
                    .limit(5) // 상위 5개 항목만 선택
                    .collect(Collectors.toList());

            // 필요한 필드들만 추출하여 결과 목록에 추가
            for (goods good : filteredGoods) {
                Map<String, Object> goodDetails = new HashMap<>();
                goodDetails.put("b_name", good.getbName());
                goodDetails.put("mrate", good.getMrate());
                goodDetails.put("limit", good.getLimit());
                goodDetails.put("dates", good.getDates());
                goodDetails.put("detail", good.getDetail());
                goodDetails.put("score", good.getScore());

                result.add(goodDetails);
            }
        }

        return result;  // 필터링된 25개의 상품 목록 반환
    }
}
