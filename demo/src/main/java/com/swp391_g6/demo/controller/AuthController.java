package com.swp391_g6.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.swp391_g6.demo.dto.LoginRequest;
import com.swp391_g6.demo.entity.User;
import com.swp391_g6.demo.service.AuthService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    //[POST] /api/auth/register - Đăng ký người dùng
    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody User user) {
        authService.createUser(user.getFullName(), user.getEmail(), user.getPasswordHash(), user.getRole());
        System.out.println(ResponseEntity.status(HttpStatus.CREATED).body(user));
        return ResponseEntity.status(HttpStatus.CREATED).body(user);
    }

    //[POST] /api/auth/login - Đăng nhập người dùng
    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginRequest request) {
        User user = authService.authenticate(request.getEmail(), request.getPassword());
        if (user != null) {
            return ResponseEntity.ok("Login successful");
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        }
    }

}
