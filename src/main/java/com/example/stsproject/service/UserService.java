package com.example.stsproject.service;

import com.example.stsproject.entity.Users;
import com.example.stsproject.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import jakarta.servlet.http.HttpSession;

import java.util.Optional;



@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public String signup(Users user) {
        // ID 중복 확인
        if (userRepository.findById(user.getId()).isPresent()) {
            throw new IllegalArgumentException("ID already exists");
        }

        // 사용자 저장
        userRepository.save(user);
        return "Signup successful";
    }
    public Users login(String id, String pw, HttpSession session) {

        Optional<Users> optionalUser = userRepository.findById(id);
        Users user = optionalUser.get();
        if (user != null && pw.equals(user.getPw())) {
            session.setAttribute("id", id);
            session.setAttribute("name", user.getName());
            return user;
        }

        throw new IllegalArgumentException("Invalid id or password");
    }

    public void logout(HttpSession session) {
        session.invalidate();
    }

    public Users getProfile(String id) {
        if (id == null) {
            throw new IllegalStateException("Login required");
        }

        Optional<Users> optionalUser = userRepository.findById(id);
        Users user = optionalUser.get();
        if (user == null) {
            throw new IllegalArgumentException("User not found");
        }

        return user;
    }

    public String updateProfile(String id, Users updatedUser, HttpSession session) {
        if (id == null) {
            throw new IllegalStateException("Login required");
        }

        Optional<Users> optionalUser = userRepository.findById(id);
        Users currentuser = optionalUser.get();
        if (currentuser == null) {
            throw new IllegalArgumentException("User not found");
        }

        currentuser.setName(updatedUser.getName());
        currentuser.setId(updatedUser.getId());
        if (updatedUser.getPw() != null && !updatedUser.getPw().isEmpty()) {
            currentuser.setPw(updatedUser.getPw());
        }

        userRepository.save(currentuser);
        session.setAttribute("id", currentuser.getId());
        session.setAttribute("name", currentuser.getName());

        return "Profile updated successfully";
    }

    public String deleteAccount(String id, HttpSession session) {
        if (id == null) {
            throw new IllegalStateException("Login required");
        }

        // 사용자 조회
        Optional<Users> optionalUser = userRepository.findById(id);
        if (optionalUser.isEmpty()) {
            throw new IllegalArgumentException("User not found");
        }

        // 사용자 삭제
        userRepository.deleteById(id);

        // 세션 무효화
        session.invalidate();

        return "Account deleted successfully";
    }

}