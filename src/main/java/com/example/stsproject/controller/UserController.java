package com.example.stsproject.controller;

import com.example.stsproject.entity.Users;
import com.example.stsproject.repository.UserRepository;

import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.util.Map;
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
        //log.info("랜덤 스코어 :{}",randomScore);

        // 랜덤 스코어 반환
        return randomScore;
    }

    @GetMapping("/test")
    public int test(){
        Random rd = new Random();
        int com = 500 + rd.nextInt(401); // 500~900 범위 생성
        return com;
    }

//    db testing
    @GetMapping("/contest")
    public String contest() {
        // 특정 사용자 (parkgw2000)의 score를 조회
        String userId = "parkgw2000";

        Optional<Users> userOptional = userRepository.findById(userId);

        if (userOptional.isPresent()) {
            // 사용자 정보가 있으면 score 반환
            Users user = userOptional.get();
            return "Score of " + userId + ": " + user.getScore();
        } else {
            // 사용자가 없으면 적절한 메시지 반환
            return "User not found";
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody Users user) {
        if (userRepository.findById(user.getId()).isPresent()) {
            return ResponseEntity.badRequest().body("Email already exists");
        }

        userRepository.save(user);
        return ResponseEntity.ok("Signup successful");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials, HttpSession session) {
        String id = credentials.get("id");
        String pw = credentials.get("pw");

        // 사용자 조회
        Optional<Users> optionalUser = userRepository.findById(id);

        // 사용자 존재 여부 확인
        if (optionalUser.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid ID or password");
        }

        Users user = optionalUser.get();

        // 비밀번호 확인
        if (!pw.equals(user.getPw())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid ID or password");
        }

        // 세션에 정보 저장
        session.setAttribute("id", id);
        session.setAttribute("name", user.getName());

        // 성공 응답 반환
        return ResponseEntity.ok(Map.of("message", "Login successful", "name", user.getName()));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpSession session) {
        session.invalidate();
        return ResponseEntity.ok("Logout successful");
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(HttpSession session) {
        String id = (String) session.getAttribute("id");

        if (id == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Login required");
        }

        Optional<Users> optionalUser = userRepository.findById(id);
        Users user = optionalUser.get();
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        return ResponseEntity.ok(user);
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestBody Users updatedUser, HttpSession session) {
        String id = (String) session.getAttribute("id");

        if (id == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Login required");
        }
        Optional<Users> optionalUser = userRepository.findById(id);
        Users currentUser = optionalUser.get();
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        currentUser.setName(updatedUser.getName());
        currentUser.setId(updatedUser.getId());
        if (updatedUser.getPw() != null && !updatedUser.getPw().isEmpty()) {
            currentUser.setPw(updatedUser.getPw());
        }

        userRepository.save(currentUser);
        session.setAttribute("email", currentUser.getId());
        session.setAttribute("name", currentUser.getName());

        return ResponseEntity.ok("Profile updated successfully");
    }

    @DeleteMapping("/deleteAccount")
    public ResponseEntity<?> deleteAccount(HttpSession session) {
        // 세션에서 사용자 ID 확인
        String id = (String) session.getAttribute("id");

        // 로그인 여부 확인
        if (id == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Login required");
        }

        // 사용자 조회
        Optional<Users> optionalUser = userRepository.findById(id);

        if (optionalUser.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        // 사용자 삭제
        userRepository.deleteById(id);

        // 세션 무효화
        session.invalidate();

        // 성공 메시지 반환
        return ResponseEntity.ok("Account deleted successfully");
    }


}