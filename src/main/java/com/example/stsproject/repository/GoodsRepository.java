package com.example.stsproject.repository;

import com.example.stsproject.entity.goods;
import org.springframework.data.jpa.repository.JpaRepository;

import java.math.BigDecimal;
import java.util.List;

public interface GoodsRepository extends JpaRepository<goods, String> {

    // score가 유저의 score보다 작은 상품들 조회
    List<goods> findAllByScoreLessThan(BigDecimal score);

}
