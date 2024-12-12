package com.bank.controller;

import com.bank.entity.Users;
import com.bank.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.util.Optional;
import java.util.Random;
import lombok.extern.slf4j.Slf4j;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;

@Slf4j
@RestController
@RequestMapping("/api")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    // 스코어 점수
    @GetMapping("/userscore/{email}")
    public int getScore(@PathVariable String email) {
        // 500~900 사이의 정수를 랜덤으로 생성
        Random rd = new Random();
        int randomScore = 500 + rd.nextInt(401); // 500~900 범위 생성

        // userid로 조회
        Optional<Users> userOptional = Optional.ofNullable(userRepository.findByEmail(email));

        if (userOptional.isPresent()) {
            // 사용자가 존재하면 점수 업데이트
            Users user = userOptional.get();
            user.setScore(new BigDecimal(randomScore)); // score를 BigDecimal로 가정
            userRepository.save(user);
        } else {
            // 사용자가 없으면 새 사용자 생성 및 점수 설정
            Users newUser = new Users();
            newUser.setEmail(email);
            newUser.setScore(new BigDecimal(randomScore)); // score 설정
            userRepository.save(newUser);
        }

        // 랜덤 스코어 반환
        return randomScore;
    }

    @GetMapping(path="/signup")
    public String signup(Model model) {
        model.addAttribute("user", new Users());
        return "signup_input";
    }

    @PostMapping(path="/signup")
    public String signup(@ModelAttribute Users user, Model model) {
        userRepository.save(user);
        model.addAttribute("name", user.getName());
        return "signup_done";
    }

    @PostMapping(path="/login")//로그인 기능
    public String login(@RequestParam(name="email") String email, @RequestParam(name="pw") String pw,
                        HttpServletRequest request, HttpSession session, RedirectAttributes rd) {
        Users user = userRepository.findByEmail(email);
        if(user != null){
            if(pw.equals(user.getPw())){
                session.setAttribute("email", email);
                session.setAttribute("name", user.getName());
                return "redirect:/";
            }
        }
        request.setAttribute("msg", "이메일 혹은 비밀번호가 틀렸습니다.");
        request.setAttribute("url", "/login");
        return "alert";
    }

    @GetMapping(path="/login") //로그인
    public String loginForm(){
        return "login";
    }

    @GetMapping(path="/logout")//로그아웃
    public String logout(HttpSession session, Model model){
        session.invalidate();
        return "redirect:/";
    }

    @GetMapping(path="/edit")
    public String showEditProfileForm(HttpSession session, RedirectAttributes rd, Model model) {
        String email = (String) session.getAttribute("email");
        if (email == null) {
            rd.addFlashAttribute("reason", "login required");
            return "redirect:/error";
        }

        Users currentUser = userRepository.findByEmail(email);
        if (currentUser == null) {
            rd.addFlashAttribute("reason", "user not found");
            return "redirect:/error";
        }

        model.addAttribute("user", currentUser);

        return "edit_profile";
    }

    @PostMapping(path="/edit")
    public String editProfile(@ModelAttribute Users user, HttpSession session, RedirectAttributes rd, Model model) {
        String email = (String) session.getAttribute("email");
        String name = (String) session.getAttribute("name");
        if (email == null) {
            rd.addFlashAttribute("reason", "login required");
            return "redirect:/error";
        }

        Users currentUser = userRepository.findByEmail(email);
        if (currentUser == null) {
            rd.addFlashAttribute("reason", "user not found");
            return "redirect:/error";
        }

        currentUser.setEmail(user.getEmail());
        currentUser.setName(user.getName());
        if (!user.getPw().isEmpty()) {
            currentUser.setPw(user.getPw());
        }

        userRepository.save(currentUser);
        session.setAttribute("email", currentUser.getEmail());
        session.setAttribute("name", currentUser.getName());

        model.addAttribute("user", currentUser);
        return "main";
    }

    @GetMapping("/ttt")
    public String serveReactPage() {
        return "forward:/index.html"; // React의 index.html을 반환
    }
}
