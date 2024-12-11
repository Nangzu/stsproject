package com.bank.controller;

import com.bank.entity.Users;
import com.bank.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.util.Optional;
import java.util.Random;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequestMapping("/api")
@RestController
public class UserController {

    @Autowired
    private UserRepository userRepository;

    // 스코어 점수
    @GetMapping("/userscore/{userid}")
    public int getScore(@PathVariable String userid) {
        // 500~900 사이의 정수를 랜덤으로 생성
        Random rd = new Random();
        int randomScore = 500 + rd.nextInt(401); // 500~900 범위 생성

        // userid로 조회
        Optional<Users> userOptional = userRepository.findById(userid);

        if (userOptional.isPresent()) {
            // 사용자가 존재하면 점수 업데이트
            Users user = userOptional.get();
            user.setScore(new BigDecimal(randomScore)); // score를 BigDecimal로 가정
            userRepository.save(user);
        } else {
            // 사용자가 없으면 새 사용자 생성 및 점수 설정
            Users newUser = new Users();
            newUser.setId(userid);
            newUser.setScore(new BigDecimal(randomScore)); // score 설정
            userRepository.save(newUser);
        }
        log.info("랜덤 스코어 :{}",randomScore);

        // 랜덤 스코어 반환
        return randomScore;
    }
}
